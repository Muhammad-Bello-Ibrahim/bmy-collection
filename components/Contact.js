'use client';

import { useRef, useState } from 'react';

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you — your enquiry has been noted. We will reach out shortly.');
    formRef.current.reset();
  };

  return (
    <section id="contact">
      <div className="wrap contact-grid">
        <div className="contact-left reveal">
          <p className="eyebrow">Contact</p>
          <h2>Place your order.</h2>
          <p className="lede">Reach the atelier directly. Bring your event date, your fabric preference, and the silhouette you have in mind — we&apos;ll take it from there.</p>

          <form ref={formRef} id="bespokeForm" onSubmit={onSubmit}>
            <div className="field"><label htmlFor="fname">Full name</label><input type="text" id="fname" name="fname" placeholder="Your name" required /></div>
            <div className="field"><label htmlFor="fphone">Phone / WhatsApp</label><input type="tel" id="fphone" name="fphone" placeholder="080..." required /></div>
            <div className="field">
              <label htmlFor="finterest">Interested in</label>
              <select id="finterest" name="finterest">
                <option>Bespoke caftan / agbada</option>
                <option>Ready-to-wear</option>
                <option>Group / family order</option>
                <option>Fabric — shadda / yards</option>
                <option>Accessories &amp; fragrance</option>
              </select>
            </div>
            <div className="field"><label htmlFor="fmsg">Message</label><textarea id="fmsg" name="fmsg" rows="4" placeholder="Event date, fabric preference, silhouette..."></textarea></div>
            <div className="contact-cta">
              <button type="submit" className="btn btn-solid">Send Enquiry</button>
            </div>
            <p id="form-status" role="status">{status}</p>
          </form>
        </div>

        <div className="reveal">
          <div className="studio-block">
            <p className="eyebrow">Studio</p>
            <h3>BMY Collection</h3>
            <div className="studio-row"><span className="r-label">Location</span><span className="r-val">Gombe, Gombe State, Nigeria</span></div>
            <div className="studio-row"><span className="r-label">Hours</span><span className="r-val">By appointment for bespoke fittings, Mon – Sat</span></div>
            <div className="studio-row"><span className="r-label">Enquiries</span><span className="r-val">Via Instagram, TikTok, or the form</span></div>
            <div className="social-row">
              <a href="https://www.instagram.com/bmy_collection_/" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#ic-ig" /></svg></a>
              <a href="https://www.tiktok.com/@bmycollection" target="_blank" rel="noopener" aria-label="TikTok"><svg><use href="#ic-tiktok" /></svg></a>
              <a href="#" target="_blank" rel="noopener" aria-label="Facebook"><svg><use href="#ic-fb" /></svg></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
