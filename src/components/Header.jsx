import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without jumping
        window.history.pushState(null, '', hash);
      }
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={() => window.scrollTo(0,0)}>
          <img
            src="/logo.png"
            alt="2D Consultores"
            className="logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="logo-text" style={{ display: 'none' }}>2D CONSULTORES</span>
        </Link>

        <nav className="navbar">
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item"><a href="#home" className="nav-link" onClick={(e) => handleNavClick(e, '#home')}>Início</a></li>
            <li className="nav-item"><a href="#sobre" className="nav-link" onClick={(e) => handleNavClick(e, '#sobre')}>Sobre</a></li>
            <li className="nav-item"><a href="#servicos" className="nav-link" onClick={(e) => handleNavClick(e, '#servicos')}>Serviços</a></li>
            <li className="nav-item"><a href="#ferramentas" className="nav-link" onClick={(e) => handleNavClick(e, '#ferramentas')}>Ferramentas</a></li>
            <li className="nav-item"><a href="#reforma-tributaria" className="nav-link" onClick={(e) => handleNavClick(e, '#reforma-tributaria')}>Reforma Tributária</a></li>
            <li className="nav-item"><a href="#eventos" className="nav-link" onClick={(e) => handleNavClick(e, '#eventos')}>Eventos</a></li>
            <li className="nav-item"><a href="#segmentos" className="nav-link" onClick={(e) => handleNavClick(e, '#segmentos')}>Segmentos</a></li>
            <li className="nav-item"><a href="#clientes" className="nav-link" onClick={(e) => handleNavClick(e, '#clientes')}>Clientes</a></li>
            <li className="nav-item"><Link to="/midia" className="nav-link" onClick={closeMenu}>Na Mídia</Link></li>
            <li className="nav-item"><a href="#contato" className="nav-link btn-outline" onClick={(e) => handleNavClick(e, '#contato')}>Contato</a></li>
            <li className="nav-item">
              <a
                href="https://www.youtube.com/@PodcastNemTudoSaoFlores"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-podcast"
                aria-label="Podcast Nem Tudo São Flores"
              >
                <img src="/nem tudo são flores.png" alt="Nem Tudo São Flores" className="podcast-icon" />
              </a>
            </li>
          </ul>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </div>
    </header>
  );
}
