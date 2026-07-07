import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import {
  TrendingUp, ShieldCheck, FileText, Calculator,
  PieChart, Settings, ShoppingCart, Mail, Phone,
  MapPin, Send, CheckCircle, AlertCircle, Loader, X,
  Calendar as CalendarIcon, Clock
} from 'lucide-react';
import './index.css';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const productsGridRef = useRef(null);
  
  const [expandedEvent, setExpandedEvent] = useState(null);
  const eventsGridRef = useRef(null);
  
  // Eventos State
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(false);
  const [visibleEventsLimit, setVisibleEventsLimit] = useState(4);

  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const formRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedProduct && productsGridRef.current && !productsGridRef.current.contains(event.target)) {
        setExpandedProduct(null);
      }
      if (expandedEvent !== null && eventsGridRef.current && !eventsGridRef.current.contains(event.target)) {
        setExpandedEvent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedProduct, expandedEvent]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiKey = import.meta.env.VITE_GCAL_API_KEY || 'AIzaSyAlPHKwLrz-9v9FVnLHZ9MgZNNsCFgDDZ4';
        const calendarId = import.meta.env.VITE_GCAL_CALENDAR_ID || 'brunoduarte.inf@gmail.com';
        
        const now = new Date();
        now.setHours(0,0,0,0);
        const timeMin = now.toISOString();

        // API Oficial do Google Calendar
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=10`;
        
        const response = await fetch(url);
        if (!response.ok) {
           console.error("Erro na API do Google", await response.text());
           throw new Error('Falha ao buscar eventos da API Oficial');
        }
        
        const data = await response.json();
        
        // Mapeia os eventos retornados pela API
        const upcoming = (data.items || []).map(item => {
          // Eventos de dia inteiro (all-day) retornam `start.date`, eventos com hora retornam `start.dateTime`
          const startDateStr = item.start.dateTime || item.start.date;
          const endDateStr = item.end.dateTime || item.end.date;
          
          return {
            title: item.summary,
            description: item.description,
            location: item.location,
            startDate: new Date(startDateStr),
            endDate: new Date(endDateStr)
          };
        });
          
        setEvents(upcoming);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        setEventsError(true);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    })
    .catch(() => {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    });
  };

  const currentYear = new Date().getFullYear();

  const clients = [
    { name: "Lupi", img: "/clientes/lupi.png" },
    { name: "Pecita", img: "/clientes/Pecita.png" },
    { name: "Grupo Crac", img: "/clientes/gupocrac.png" },
    { name: "Ibad Autopeças", img: "/clientes/ibad.png" },
    { name: "Rio Lub", img: "/clientes/riolub.png" },
    { name: "Auto Sul", img: "/clientes/autosul.png" },
    { name: "Rio JC", img: "/clientes/riojc.png" },
    { name: "DISTR. 27 DE SETEMBRO", img: "/clientes/27desetembrodistribuidora.png" },
    { name: "WIDMEN", img: "/clientes/widmen.svg" },
    { name: "GOLFINHO", img: "/clientes/golfinho.png" },
    { name: "GRUPO MOTOBRAS", img: "/clientes/grupomotobras.webp", className: "motobras-logo" },
    { name: "GOMEC", img: "/clientes/gomec.png" }
  ];

  return (
    <>
      {/* Navbar */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#home" className="logo">
            {/* Adicione a logo aqui, caso houver problema a fallback funcionará */}
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
          </a>

          <nav className="navbar">
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <li className="nav-item"><a href="#home" className="nav-link" onClick={closeMenu}>Início</a></li>
              <li className="nav-item"><a href="#sobre" className="nav-link" onClick={closeMenu}>Sobre</a></li>
              <li className="nav-item"><a href="#servicos" className="nav-link" onClick={closeMenu}>Serviços</a></li>
              <li className="nav-item"><a href="#ferramentas" className="nav-link" onClick={closeMenu}>Ferramentas</a></li>
              <li className="nav-item"><a href="#reforma-tributaria" className="nav-link" onClick={closeMenu}>Reforma Tributária</a></li>
              <li className="nav-item"><a href="#eventos" className="nav-link" onClick={closeMenu}>Eventos</a></li>
              <li className="nav-item"><a href="#segmentos" className="nav-link" onClick={closeMenu}>Segmentos</a></li>
              <li className="nav-item"><a href="#clientes" className="nav-link" onClick={closeMenu}>Clientes</a></li>
              <li className="nav-item"><a href="#contato" className="nav-link btn-outline" onClick={closeMenu}>Contato</a></li>
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

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Impulsionando Seus Resultados com <span className="highlight">Estratégia e Inteligência</span></h1>
            <p className="hero-subtitle">
            A 2D Consultores tem mais de 15 anos de mercado e é especialista em Consultoria Fiscal, Tributária e Gestão Empresarial para os setores Automotivo e Supermercadista.
          </p>  <div className="hero-actions">
              <a href="#servicos" className="btn btn-primary">Nossos Serviços</a>
              <a href="#contato" className="btn btn-secondary">Fale com um Consultor</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="section about-section" id="sobre" style={{ backgroundImage: "url('/Marco Flores.webp')" }}>
        <div className="about-overlay"></div>
        <div className="container about-container">
          <div className="about-text">
            <span className="section-tag">Sobre a 2D Consultores</span>
            <h2 className="section-title">Parceria que Gera <span className="highlight">Valor</span></h2>
            <p>A 2D Consultores é uma empresa focada em transformar a realidade de negócios complexos. Com atuação de destaque nos segmentos de reposição automotiva e supermercadista, compreendemos profundamente os desafios e oportunidades dessas indústrias.</p>
            <p>Nossa missão é entregar soluções personalizadas que otimizem os recursos financeiros, garantam conformidade fiscal e elevem o patamar de gestão da sua empresa, garantindo um crescimento sustentável e seguro no longo prazo.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <TrendingUp className="stat-icon" />
                <h3>Crescimento</h3>
                <p>Foco em resultados</p>
              </div>
              <div className="stat-card">
                <ShieldCheck className="stat-icon" />
                <h3>Segurança</h3>
                <p>Tranquilidade fiscal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section className="section bg-alt" id="servicos">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nossa Expertise</span>
            <h2 className="section-title">Soluções <span className="highlight">Completas</span></h2>
            <p className="section-description">Oferecemos um portfólio integrado para apoiar a gestão integral do seu negócio.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrapper">
                <FileText className="service-icon" />
              </div>
              <h3 className="service-title">Consultoria Fiscal</h3>
              <p className="service-description">Planejamento, revisão e auditoria para garantir a correta apuração de impostos e entrega de obrigações acessórias, mitigando riscos de autuações e multas.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <Calculator className="service-icon" />
              </div>
              <h3 className="service-title">Consultoria Tributária</h3>
              <p className="service-description">Análise estratégica de enquadramentos, recuperação de créditos e otimização da carga tributária visando melhorar o fluxo de caixa da sua empresa.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <PieChart className="service-icon" />
              </div>
              <h3 className="service-title">Gestão Empresarial</h3>
              <p className="service-description">Desenvolvimento de indicadores de performance, estruturação de processos e apoio na tomada de decisão para escalar o negócio de forma organizada.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Ferramentas Section */}
      <section className="section bg-alt" id="ferramentas">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Ecossistema 2D</span>
            <h2 className="section-title">Nossas <span className="highlight">Ferramentas</span></h2>
            <p className="section-description">Soluções desenvolvidas para transformar a gestão do seu negócio.</p>
          </div>

          <div ref={productsGridRef} className={`products-grid ${expandedProduct ? 'expanded-mode' : ''}`}>
            {[
              {
                id: 'plataforma2d',
                title: 'Plataforma 2D',
                icon: '/plataforma-2d-2.webp',
                iconClass: 'product-icon product-icon-white',
                shortDesc: 'Solução inovadora de aprendizado prático em gestão, finanças e fiscal, com integração perfeita ao sistema da sua autopeça.',
                longDesc: 'Descubra a nossa plataforma digital, a solução inovadora que vai revolucionar a forma como sua empresa se conecta ao conhecimento. Focamos em oferecer aprendizado prático e resultados concretos, eliminando conceitos que não trazem valor. Reconhecida em todo o Brasil, nossa plataforma oferece acesso a conteúdos essenciais nas áreas de gestão, finanças e fiscal. Com um modelo de precificação avassalador, especialmente criado para o setor de autopeças, você pode maximizar sua rentabilidade e competitividade. Outra grande vantagem? Nossa solução se integra perfeitamente ao sistema que sua autopeça já utiliza, garantindo uma transição suave e facilitando a adoção de nossos serviços. Com nossa metodologia eficaz, ajudamos empresas a se tornarem referências em seus setores. Junte-se a nós e impulsione seu negócio para novos patamares de excelência!',
                buttonText: 'Conheça a ferramenta →',
                highlight: false,
                isNew: false
              },
              {
                id: 'controladoria',
                title: 'Controladoria',
                icon: '/controladoria-2.webp',
                iconClass: 'product-icon product-icon-white',
                shortDesc: 'Garante a eficiência dos processos organizacionais e a geração de informações precisas para decisões estratégicas e gestão financeira.',
                longDesc: 'A controladoria é essencial para o sucesso de qualquer empresa, independentemente de seu tamanho ou setor. Ela garante a eficiência dos processos organizacionais e a geração de informações precisas para decisões estratégicas. Com o foco em fornecer dados relevantes, a controladoria ajuda a identificar oportunidades de melhoria e otimizar o uso dos recursos disponíveis. Além disso, ela exerce um papel crucial na gestão financeira, controlando gastos e investimentos, e na gestão de riscos, mitigando ameaças ao negócio. Em resumo, a controladoria é uma ferramenta indispensável que potencializa a gestão estratégica da empresa, contribuindo para decisões mais assertivas e o alcance de objetivos organizacionais. Invista em controladoria e fortaleça sua empresa!',
                buttonText: 'Conheça a ferramenta →',
                highlight: false,
                isNew: false
              },
              {
                id: '2dprice',
                title: '2DPrice',
                icon: '/logo price.svg',
                iconClass: 'product-icon product-icon--price',
                shortDesc: 'Plataforma de precificação inteligente que ajuda a melhorar a sua receita e proteger suas margens de lucro.',
                longDesc: 'O 2DPrice é a nossa plataforma definitiva de precificação inteligente, desenvolvida para transformar a maneira como você forma seus preços. Utilizando análise de dados avançada e cálculos precisos, nossa ferramenta ajuda a identificar oportunidades ocultas no seu negócio, garantindo que você não deixe dinheiro na mesa. Melhore significativamente sua receita e proteja suas margens de lucro, definindo preços mais competitivos e precisos de forma ágil e segura.',
                buttonText: 'Conheça a ferramenta →',
                highlight: true,
                isNew: false
              },
              {
                id: 'impactus',
                title: 'Impactus',
                icon: '/impactus-2.webp',
                iconClass: 'product-icon product-icon-white',
                shortDesc: 'Mentoria especializada em capacitação estratégica para quem busca evolução contínua e alta performance.',
                longDesc: (
                  <>
                    Somos uma mentoria especializada em capacitação estratégica por meio de cursos, palestras e imersões. Nosso foco é preparar empresários, estudantes e profissionais que buscam evolução contínua, alta performance e resultados sólidos.
                    <br /><br />
                    • Desenvolvimento pessoal e profissional<br />
                    • Estratégias para tomada de decisão<br />
                    • Aprimoramento de habilidades essenciais para o mercado
                  </>
                ),
                buttonText: 'Conheça a ferramenta →',
                highlight: true,
                isNew: false
              }
            ].map(tool => (
              <div 
                key={tool.id} 
                className={`product-card ${tool.highlight ? 'product-card--highlight' : ''} ${expandedProduct === tool.id ? 'expanded' : ''} ${expandedProduct && expandedProduct !== tool.id ? 'hidden-card' : ''}`}
                onClick={() => {
                  if (!expandedProduct) setExpandedProduct(tool.id);
                }}
              >
                {expandedProduct === tool.id && (
                  <button className="btn-close-card" onClick={(e) => { e.stopPropagation(); setExpandedProduct(null); }}>
                    <X size={20} />
                  </button>
                )}
                <div className="product-icon-wrapper">
                  <img src={tool.icon} alt={tool.title} className={tool.iconClass} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{tool.title}</h3>
                  {expandedProduct === tool.id ? (
                    <div className="expanded-content">
                      <p className="product-description">{tool.longDesc}</p>
                      <a href="#contato" className="btn btn-primary" onClick={(e) => e.stopPropagation()}>
                        Agendar uma Apresentação
                      </a>
                    </div>
                  ) : (
                    <div className="collapsed-content">
                      <p className="product-description">{tool.shortDesc}</p>
                      <button 
                        className={`product-link ${tool.isNew ? 'product-link--new' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProduct(tool.id);
                        }}
                      >
                        {tool.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reforma Tributária Section */}
      <section className="section" id="reforma-tributaria">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">RTC - Reforma Tributária do Consumo</span>
            <h2 className="section-title">A Nova <span className="highlight">Reforma Tributária</span></h2>
            <p className="section-description">Entenda as mudanças e saiba como a 2D Consultores protegerá o seu negócio na transição para o novo modelo fiscal brasileiro.</p>
          </div>

          <div className="tax-reform-grid">
            {/* Left side: 2D's preparation and call to action */}
            <div className="tax-reform-card tax-reform-card--primary">
              <ShieldCheck className="tax-icon text-accent" size={48} />
              <h3 className="tax-title">Sua empresa preparada para o futuro</h3>
              <p className="tax-text">
                A aprovação da Reforma Tributária do Consumo marca a maior mudança no sistema fiscal brasileiro das últimas décadas. Com a substituição de cinco tributos atuais por um modelo de IVA Dual, as regras do jogo vão mudar completamente.
              </p>
              <p className="tax-text">
                <strong>Não espere o prazo apertar.</strong> A equipe de especialistas da 2D Consultores já mapeou os cenários da transição. Estamos prontos para reestruturar seu planejamento tributário, adaptar suas estratégias de precificação e garantir que você aproveite as oportunidades legais para otimizar a carga tributária com total segurança jurídica.
              </p>
              <a href="#contato" className="btn btn-primary tax-btn">Fale com um Especialista Agora</a>
            </div>

            {/* Right side: Summary of the reform */}
            <div className="tax-reform-card tax-reform-card--secondary">
              <FileText className="tax-icon text-muted" size={48} />
              <h3 className="tax-title">O que muda com a Reforma?</h3>
              <ul className="tax-list">
                <li>
                  <strong>Simplificação Extrema:</strong> PIS, COFINS e IPI serão substituídos pela CBS (federal). O ICMS e o ISS darão lugar ao IBS (estadual/municipal).
                </li>
                <li>
                  <strong>IVA Dual:</strong> Modelo não cumulativo, em que o imposto incide apenas sobre o valor agregado em cada etapa produtiva, acabando com o "imposto sobre imposto".
                </li>
                <li>
                  <strong>Imposto Seletivo (IS):</strong> Novo tributo específico criado para desestimular o consumo de bens prejudiciais à saúde e ao meio ambiente.
                </li>
                <li>
                  <strong>Cobrança no Destino:</strong> O recolhimento passará a ocorrer no local de consumo final do produto/serviço, e não mais no estado/município de origem.
                </li>
                <li>
                  <strong>Transparência:</strong> O consumidor saberá exatamente quanto imposto está embutido no valor final da nota.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Section */}
      <section className="section bg-alt" id="eventos">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Agenda 2D</span>
            <h2 className="section-title">Próximos <span className="highlight">Eventos</span></h2>
            <p className="section-description">Fique por dentro das nossas mentorias, palestras e imersões presenciais e online.</p>
          </div>

          <div className="events-container">
            {eventsLoading ? (
              <div className="events-status">
                <Loader className="spin text-accent" size={40} />
                <p>Carregando agenda...</p>
              </div>
            ) : eventsError ? (
              <div className="events-status">
                <AlertCircle className="text-muted" size={40} />
                <p>Não foi possível carregar os eventos no momento.</p>
              </div>
            ) : events.length === 0 ? (
              <div className="events-status">
                <CalendarIcon className="text-muted" size={40} />
                <p>Fique ligado! Em breve anunciaremos nossas próximas agendas e eventos.</p>
              </div>
            ) : (
              <div className="events-grid-wrapper">
                <div className="events-grid" ref={eventsGridRef}>
                  {events.slice(0, visibleEventsLimit).map((evt, idx) => {
                    const dia = String(evt.startDate.getDate()).padStart(2, '0');
                    const mes = evt.startDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
                  const ano = evt.startDate.getFullYear();
                  const isExpanded = expandedEvent === idx;
                  
                  return (
                    <div 
                      className={`event-card ${isExpanded ? 'expanded' : ''} ${expandedEvent !== null && expandedEvent !== idx ? 'hidden-card' : ''}`} 
                      key={idx}
                      onClick={() => {
                        if (expandedEvent === null) setExpandedEvent(idx);
                      }}
                    >
                      {isExpanded && (
                        <button className="btn-close-card" onClick={(e) => { e.stopPropagation(); setExpandedEvent(null); }}>
                          <X size={20} />
                        </button>
                      )}
                      <div className="event-date-block">
                        <span className="event-day">{dia}</span>
                        <span className="event-month">{mes}</span>
                        <span className="event-year">{ano}</span>
                      </div>
                      <div className="event-details">
                        <h3 className="event-title">{evt.title || 'Evento da 2D'}</h3>
                        <div className="event-meta">
                          <span className="event-meta-item">
                            <Clock size={15} /> 
                            {evt.startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {evt.location && (
                            <span className="event-meta-item">
                              <MapPin size={15} /> 
                              {evt.location}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <div className="expanded-content">
                            {evt.description ? (
                              <p className="product-description" dangerouslySetInnerHTML={{ __html: evt.description.replace(/\n/g, '<br />') }}></p>
                            ) : (
                              <p className="product-description">Nenhuma descrição detalhada disponível para este evento.</p>
                            )}
                          </div>
                        ) : (
                          <div className="event-desc">
                            {evt.description ? evt.description.replace(/<[^>]+>/g, '') : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                </div>
                {events.length > 4 && (
                  <div className="events-load-more">
                    {visibleEventsLimit < events.length ? (
                      <button 
                        className="btn btn-outline" 
                        onClick={() => setVisibleEventsLimit(prev => prev + 4)}
                      >
                        Exibir mais eventos
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline" 
                        onClick={() => setVisibleEventsLimit(4)}
                      >
                        Recolher eventos
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Segmentos Section */}
      <section className="section" id="segmentos">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Especialização</span>
            <h2 className="section-title">Onde <span className="highlight">Atuamos</span></h2>
            <p className="section-description">Nossa vivência prática garante soluções aderentes à realidade do seu mercado.</p>
          </div>

          <div className="segments-grid">
            <div className="segment-card group">
              <div className="segment-image" style={{ backgroundImage: "url('/reposicao_automotiva.jpg')" }}>
                <div className="segment-overlay"></div>
              </div>
              <div className="segment-content">
                <Settings className="segment-icon" />
                <h3 className="segment-title">Reposição Automotiva</h3>
                <p className="segment-desc">Entendemos a complexidade de SKUs, ST e Margens deste setor dinâmico e exigente.</p>
              </div>
            </div>

            <div className="segment-card group">
              <div className="segment-image" style={{ backgroundImage: "url('/supermercado.webp')" }}>
                <div className="segment-overlay"></div>
              </div>
              <div className="segment-content">
                <ShoppingCart className="segment-icon" />
                <h3 className="segment-title">Supermercadista</h3>
                <p className="segment-desc">Lidamos com o alto volume transacional e a complexa legislação aplicável ao varejo alimentar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clientes Section (Carousel) */}
      <section className="section bg-alt" id="clientes">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Parceiros</span>
            <h2 className="section-title">Quem Confia na <span className="highlight">2D</span></h2>
          </div>

          <div className="carousel-container">
            <div className="carousel-track">
              {/* Render client logos twice for infinite scroll effect */}
              {[...clients, ...clients].map((client, index) => (
                <div className="client-logo" key={index} aria-hidden={index >= clients.length}>
                  {client.img ? (
                    <img src={client.img} alt={client.name} title={client.name} className={client.className || ""} />
                  ) : (
                    client.name
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contato Section */}
      <section className="section" id="contato">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-tag">Fale Conosco</span>
              <h2 className="section-title">Vamos impulsionar seu <span className="highlight">negócio?</span></h2>
              <p className="contact-desc">Entre em contato para agendar uma reunião ou tirar dúvidas sobre nossas soluções.</p>

              <div className="contact-methods">
                <div className="contact-method">
                  <Mail className="contact-icon" />
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:contato@2dconsultores.com.br">contato@2dconsultores.com.br</a>
                  </div>
                </div>
                <div className="contact-method">
                  <Phone className="contact-icon" />
                  <div>
                    <h4>Telefone / WhatsApp</h4>
                    <a href="tel:+550000000000">+55 (00) 00000-0000</a>
                  </div>
                </div>
                <div className="contact-method">
                  <MapPin className="contact-icon" />
                  <div>
                    <h4>Endereço</h4>
                    <p>Av. Exemplo Comercial, 1000 - Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="seu@email.com.br"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    placeholder="Como podemos ajudar?"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  ></textarea>
                </div>

                {formStatus === 'success' && (
                  <div className="form-feedback success">
                    <CheckCircle size={18} />
                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="form-feedback error">
                    <AlertCircle size={18} />
                    Erro ao enviar. Tente novamente ou entre em contato por e-mail.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? (
                    <><Loader className="btn-icon spinning" /> Enviando...</>
                  ) : (
                    <>Enviar Mensagem <Send className="btn-icon" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-logo">
            <img
              src="/logo.png"
              alt="2D Consultores"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="logo-text" style={{ display: 'none' }}>2D CONSULTORES</span>
            <p>Especialistas em Consultoria Fiscal, Tributária e Gestão Empresarial.</p>
          </div>
          <div className="footer-links">
            <h3>Links Úteis</h3>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#sobre">Sobre Nós</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#segmentos">Segmentos</a></li>
              <li><a href="https://pregao.plataforma2d.com.br/" target="_blank" rel="noopener noreferrer">Pregão Mercadológico</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Redes Sociais</h3>
            <div className="social-icons">
              <a href="https://www.linkedin.com/company/2dconsultores/?originalSubdomain=br" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://www.instagram.com/marcoflores_2d/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} 2D Consultores. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
