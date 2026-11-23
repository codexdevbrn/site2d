import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const INSTAGRAM_PROFILES = [
  { handle: '@2dconsultores', label: 'Perfil oficial da 2D Consultores', url: 'https://www.instagram.com/2dconsultores/' },
  { handle: '@marcoflores_2d', label: 'Perfil do Marco Flores', url: 'https://www.instagram.com/marcoflores_2d/' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showInstagram, setShowInstagram] = useState(false);

  useEffect(() => {
    if (!showInstagram) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowInstagram(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showInstagram]);

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', hash);
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-links">
          <h3>Links Úteis</h3>
          <ul>
            <li><Link to="/" onClick={() => window.scrollTo(0,0)}>Início</Link></li>
            <li><a href="#sobre" onClick={(e) => handleNavClick(e, '#sobre')}>Sobre Nós</a></li>
            <li><a href="#servicos" onClick={(e) => handleNavClick(e, '#servicos')}>Serviços</a></li>
            <li><a href="#segmentos" onClick={(e) => handleNavClick(e, '#segmentos')}>Segmentos</a></li>
            <li><Link to="/midia" onClick={() => window.scrollTo(0,0)}>Na Mídia</Link></li>
            <li><a href="https://pregao.plataforma2d.com.br/" target="_blank" rel="noopener noreferrer">Pregão Mercadológico</a></li>
          </ul>
          <p className="footer-desc">Especialistas em Consultoria Fiscal, Tributária e Gestão Empresarial.</p>
        </div>
        <div className="footer-logo">
          <Link to="/" onClick={() => window.scrollTo(0,0)}>
            <img
              src="/logo-rodape.png"
              alt="2D Consultores"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="logo-text" style={{ display: 'none' }}>2D CONSULTORES</span>
          </Link>
        </div>
        <div className="footer-social">
          <h3>Redes Sociais</h3>
          <div className="social-icons">
            <a href="https://www.linkedin.com/company/2dconsultores/?originalSubdomain=br" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <button type="button" onClick={() => setShowInstagram(true)} aria-label="Instagram" aria-haspopup="dialog">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} 2D Consultores. Todos os direitos reservados.</p>
      </div>

      {showInstagram && (
        <div className="ig-popup-backdrop" onClick={() => setShowInstagram(false)}>
          <div
            className="ig-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ig-popup-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="ig-popup-close" onClick={() => setShowInstagram(false)} aria-label="Fechar">
              <X size={18} />
            </button>
            <h3 id="ig-popup-title">Siga a 2D no Instagram</h3>
            <p>Escolha qual perfil você quer acessar:</p>
            <div className="ig-popup-options">
              {INSTAGRAM_PROFILES.map((profile) => (
                <a
                  key={profile.handle}
                  className="ig-popup-option"
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowInstagram(false)}
                >
                  <strong>{profile.handle}</strong>
                  <span>{profile.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
