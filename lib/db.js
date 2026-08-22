// lib/db.js
import dns from 'dns';
import mongoose from 'mongoose';

// Override DNS resolvers so SRV queries bypass ISP DNS that refuses them
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  console.warn('[db] MONGODB_URI not set — database features disabled');
}

/**
 * If the standard SRV URI fails (ISP intercepts/blocks DNS SRV queries),
 * fall back to resolving via Cloudflare DNS-over-HTTPS (port 443, never blocked)
 * and build a direct mongodb:// URI from the resolved Atlas shard hostnames.
 */
async function resolveViaDoH(srvURI) {
  const m = srvURI.match(/^mongodb\+srv:\/\/([^@]+)@([^/?#]+)(\/[^?#]*)?(\?.*)?$/);
  if (!m) return null;
  const [, creds, srvHost, dbPath = '/bmy-collection', qs = ''] = m;

  try {
    // 1. Resolve SRV records: _mongodb._tcp.<host>
    const srvName = `_mongodb._tcp.${srvHost}`;
    const srvResp = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(srvName)}&type=SRV`,
      { headers: { accept: 'application/dns-json' } }
    );
    const srvJson = await srvResp.json();
    const srvAnswers = (srvJson.Answer || []).filter(r => r.type === 33);
    if (!srvAnswers.length) throw new Error('No SRV answers from DoH');

    // Parse "priority weight port target."
    const hosts = srvAnswers.map(r => {
      const parts = r.data.trim().split(/\s+/);
      const port = parts[2];
      const target = parts[3].replace(/\.$/, '');
      return `${target}:${port}`;
    }).join(',');

    // 2. Resolve TXT record to get replicaSet name
    const txtResp = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(srvHost)}&type=TXT`,
      { headers: { accept: 'application/dns-json' } }
    );
    const txtJson = await txtResp.json();
    let replicaSet = '';
    for (const r of (txtJson.Answer || [])) {
      const txt = (r.data || '').replace(/"/g, '');
      const rsMatch = txt.match(/replicaSet=([^&\s,]+)/);
      if (rsMatch) { replicaSet = rsMatch[1]; break; }
    }

    // 3. Build direct mongodb:// URI
    let directURI = `mongodb://${creds}@${hosts}${dbPath}?tls=true&authSource=admin`;
    if (replicaSet) directURI += `&replicaSet=${replicaSet}`;
    if (qs) directURI += `&${qs.replace(/^\?/, '')}`;

    console.log('[db] Resolved via DNS-over-HTTPS. Hosts:', hosts);
    return directURI;
  } catch (e) {
    console.warn('[db] DoH resolution failed:', e.message);
    return null;
  }
}

let cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable not set');
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 12000,
        connectTimeoutMS: 12000,
      };

      // Try standard SRV URI first
      try {
        return await mongoose.connect(MONGODB_URI, opts);
      } catch (err) {
        // On any DNS/SRV failure, try DNS-over-HTTPS fallback
        const isDNSError =
          err.message?.includes('querySrv') ||
          err.message?.includes('ECONNREFUSED') ||
          err.message?.includes('ENOTFOUND') ||
          err.message?.includes('EAI_');
        if (isDNSError) {
          console.warn('[db] SRV lookup failed, trying DNS-over-HTTPS fallback…');
          const directURI = await resolveViaDoH(MONGODB_URI);
          if (directURI) {
            return await mongoose.connect(directURI, opts);
          }
        }
        throw err;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
