import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import {
  TrendingUp, ShieldCheck, FileText, Calculator,
  PieChart, Settings, ShoppingCart, Mail, Phone,
  MapPin, Send, CheckCircle, AlertCircle, Loader, X,
  Calendar as CalendarIcon, Clock, Users
} from 'lucide-react';
import '../index.css';
import CountUp from '../components/CountUp';

export default function Home() {
  const { hash } = window.location;
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  
  
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

  // Importação automática de todas as imagens da pasta src/assets/clientes
  const clientModules = import.meta.glob('../assets/clientes/*.{png,jpg,jpeg,svg,webp,avif}', { eager: true, import: 'default' });
  let clients = Object.values(clientModules).map(imgUrl => ({
    name: "Cliente",
    img: imgUrl
  }));

  // Ordem de prioridade para os primeiros clientes
  const priorityOrder = ['syl', 'petronas', 'ipiranga'];

  clients.sort((a, b) => {
    const aLower = a.img.toLowerCase();
    const bLower = b.img.toLowerCase();
    
    let aIndex = priorityOrder.findIndex(p => aLower.includes(p));
    let bIndex = priorityOrder.findIndex(p => bLower.includes(p));
    
    if (aIndex === -1) aIndex = 999; // Se não for prioridade, vai pro final
    if (bIndex === -1) bIndex = 999;
    
    if (aIndex !== bIndex) {
      return aIndex - bIndex; // Ordena pelos prioritários primeiro
    }
    
    return aLower.localeCompare(bLower); // O restante fica em ordem alfabética
  });

  return (
    <>
      

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Inteligência Fiscal, Tributária e <span className="highlight">Gestão Especializada para o Setor Automotivo</span></h1>
            <p className="hero-subtitle">
            Com mais de 16 anos de mercado, somos seu Parceiro em Consultoria. Oferecemos três frentes de atuação integradas: o fiscal que protege, a gestão que organiza e a tecnologia que executa no automático.
            </p>
            <div className="hero-actions">
              <a href="#servicos" className="btn btn-primary">Nossos Serviços</a>
              <a href="#contato" className="btn btn-secondary">Fale com um Consultor</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre / Marco Flores Section */}
      <section className="section about-section" id="sobre" style={{ backgroundImage: "url('/Marco Flores.webp')", backgroundPosition: "center top" }}>
        <div className="about-overlay"></div>
        <div className="container about-container">
          <div className="about-text">
            <span className="section-tag">Quem Está por Trás da 2D Consultores</span>
            <h2 className="section-title">Marco <span className="highlight">Flores</span></h2>
            <p><strong>Fundador, Estrategista de Negócios e Especialista em Inteligência Tributária.</strong></p>
            <p>"Mais do que um relatório, entrego uma ferramenta de decisão. Junto a ela, trago milhares de horas de mesa que me deram a bagagem necessária para gerar resultados em qualquer negócio."</p>
            <p>Com mais de 21 anos de experiência prática na liderança das maiores empresas de reposição automotiva do Rio de Janeiro, Marco Flores traz a vivência real do setor para o seu negócio. Integrou o conselho da maior rede de autopeças da América Latina e contribuiu ativamente no desenho da automação tributária junto à SEFAZ RJ. É também colunista do Jornal Brasil.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <ShieldCheck className="stat-icon" />
                <h3><CountUp end={16} /> Anos</h3>
                <p>de Experiência e Mercado</p>
              </div>
              <div className="stat-card">
                <Users className="stat-icon" />
                <h3><CountUp end={100} /> Clientes</h3>
                <p>Atendidos com Sucesso</p>
              </div>
              <div className="stat-card">
                <TrendingUp className="stat-icon" />
                <h3>Resultados</h3>
                <p>Inteligência Tributária e Gestão Empresarial</p>
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
              <h3 className="service-title">Consultoria Fiscal e Tributária</h3>
              <p className="service-description">Realizamos a recuperação de créditos tributários acumulados, desenvolvemos planejamento fiscal focado no seu segmento e encontramos onde o seu dinheiro está preso.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <Calculator className="service-icon" />
              </div>
              <h3 className="service-title">Gestão Empresarial</h3>
              <p className="service-description">Diagnóstico completo de toda a sua operação logística e comercial, mapeamento de gargalos e foco total em redução de custos operacionais e ganho de tempo.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <PieChart className="service-icon" />
              </div>
              <h3 className="service-title">Soluções Digitais (Exclusividade 2D)</h3>
              <p className="service-description">Apoiamos a sua tomada de decisão saindo das planilhas manuais. Apresentamos ao mercado automotivo a Plataforma 2D Price para alavancar financeiramente autopeças.</p>
            </div>
          </div>

          {/* Metodologia (O Caminho do Sucesso) */}
          <div className="methodology-container" style={{ marginTop: '5rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h3 className="section-title">Nosso Método de <span className="highlight">Trabalho</span></h3>
              <p className="section-description">O caminho comprovado para transformar os resultados da sua empresa.</p>
            </div>
            
            <div className="timeline">
              <div className="timeline-step">
                <div className="timeline-icon">1</div>
                <div className="timeline-content">
                  <h4>Diagnóstico Inicial</h4>
                  <p>Mapeamento completo da operação e auditoria fiscal profunda.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon">2</div>
                <div className="timeline-content">
                  <h4>Planejamento Estratégico</h4>
                  <p>Desenho da solução com foco em redução de custos e recuperação de créditos.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon">3</div>
                <div className="timeline-content">
                  <h4>Execução Prática</h4>
                  <p>Implementação ágil das melhorias tributárias e adoção de ferramentas tecnológicas.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon">4</div>
                <div className="timeline-content">
                  <h4>Acompanhamento</h4>
                  <p>Monitoramento de KPIs, adequação legislativa e suporte consultivo contínuo.</p>
                </div>
              </div>
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
                id: 'apura',
                title: 'Apura',
                icon: '/logo_apura8.svg',
                iconClass: 'product-icon product-icon-white',
                shortDesc: 'Inteligência que apura, resultados que protegem: conduza as operações e análises fiscais da sua empresa em um ambiente seguro e centralizado.',
                longDesc: 'A APURA é a ferramenta de inteligência fiscal da 2D Consultores, criada para reunir em um único ambiente protegido todas as operações e análises tributárias da sua empresa. Chega de dados espalhados entre planilhas e sistemas paralelos: com a APURA, sua equipe apura informações fiscais com precisão, identifica inconsistências antes que se transformem em autuações e converte dados em decisões estratégicas seguras. Mais do que controle, é proteção — inteligência que apura, resultados que protegem o seu negócio enquanto ele cresce.',
                buttonText: 'Conheça a ferramenta →',
                highlight: true,
                isNew: true
              },
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
                O sistema tributário do Brasil está mudando drasticamente. Quem deixar para se organizar apenas no momento da cobrança efetiva sentirá o prejuízo direto no caixa. A 2D Consultores acompanha essa transição passo a passo com você, revisando classificações e ajustando sistemas para evitar autuações surpresa.
              </p>
              <p className="tax-text">
                <strong>Não espere o prazo apertar.</strong> A equipe de especialistas da 2D Consultores já mapeou os cenários da transição. Estamos prontos para reestruturar seu planejamento tributário e garantir que você aproveite as oportunidades legais para otimizar a carga tributária com total segurança jurídica.
              </p>
              <a href="#contato" className="btn btn-primary tax-btn">Fale com um Especialista Agora</a>
            </div>

            {/* Right side: Summary of the reform */}
            <div className="tax-reform-card tax-reform-card--secondary">
              <FileText className="tax-icon text-muted" size={48} />
              <h3 className="tax-title">O Cronograma da Transição</h3>
              <ul className="tax-list">
                <li>
                  <strong>2026 (Fase de Testes):</strong> Toda nota fiscal emitida no país já apresenta o CBS (0,9%) e o IBS (0,1%) para fins de validação e exigência de classificação correta, ainda sem cobrança efetiva.
                </li>
                <li>
                  <strong>2027 (Início da Cobrança Real):</strong> Os novos impostos entram em vigor e os antigos tributos PIS, Cofins e IPI começam a sair de cena.
                </li>
                <li>
                  <strong>2029 a 2032 (Transição Gradual):</strong> O ICMS e o ISS são substituídos gradualmente pelo IBS, ano após ano.
                </li>
                <li>
                  <strong>2033 (Sistema Integral):</strong> O novo modelo tributário passa a valer de forma unificada e cheia em todo o território nacional.
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
      <section className="section bg-alt" id="segmentos">
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
            <div className="carousel-track" style={{ '--count': clients.length }}>
              {/* Render client logos 3 times for center-start infinite scroll effect */}
              {[...clients, ...clients, ...clients].map((client, index) => (
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

      {/* Depoimentos Section */}
      <section className="section" id="depoimentos">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Resultados Reais</span>
            <h2 className="section-title">O que dizem nossos <span className="highlight">Clientes</span></h2>
            <p className="section-description">Ferramentas e suporte que mudam a história das empresas.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">Desde o início, tive o privilégio de acompanhar a Plataforma 2D. Essa ferramenta vem mudando a história das empresas que fazem parte desse projeto.</p>
              <div className="testimonial-author">
                <div className="testimonial-author-info">
                  <h4>Fernando Fernandes</h4>
                  <p>Golfinho Moto Peças The Best</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">Utilizar a Plataforma 2D tem sido excelente nas tomadas de decisão. Gestão com informação é tudo. É possível corrigir dados fiscais dentro do cadastro dos itens, evitando risco tributário.</p>
              <div className="testimonial-author">
                <div className="testimonial-author-info">
                  <h4>Orni Barbosa</h4>
                  <p>IBAD Autopeças</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">Desde que passamos a contar com o suporte da 2D Consultores, nossa operação ganhou muito mais segurança e eficiência. Um investimento que se paga rápido.</p>
              <div className="testimonial-author">
                <div className="testimonial-author-info">
                  <h4>Alfredo Corapi</h4>
                  <p>Altese Autopeças</p>
                </div>
              </div>
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
                    <a href="mailto:farley@2dconsultores.com.br">farley@2dconsultores.com.br</a>
                  </div>
                </div>
                <div className="contact-method">
                  <Phone className="contact-icon" />
                  <div>
                    <h4>Telefone / WhatsApp</h4>
                    <a href="tel:+5521984157985">+55 21 98415-7985</a>
                  </div>
                </div>
                <div className="contact-method">
                  <MapPin className="contact-icon" />
                  <div>
                    <h4>Endereço</h4>
                    <p>Rod. Washington Luiz, 2500 - 2550 - Parque Duque, Duque de Caxias - RJ, 25085-009</p>
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

      
    </>
  );
}


