export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="foot-brand">
            <span className="word">BMY</span>
            <p className="tag">Menswear Atelier · Gombe</p>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <a href="#collection">Collection</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="foot-col">
            <h5>Studio</h5>
            <span>Gombe, Gombe State</span>
            <span>Nigeria</span>
            <span>By appointment only</span>
          </div>
          <div className="foot-col">
            <h5>Follow</h5>
            <a href="https://www.instagram.com/bmy_collection_/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.tiktok.com/@bmycollection" target="_blank" rel="noopener">TikTok</a>
            <a href="#">Facebook</a>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} BMY Collection. Every piece finished by hand.</p>
          <p>Crafted in Gombe</p>
        </div>
      </div>
    </footer>
  );
}
