import { useEffect, useState } from 'react';
import { PlayCircle, Mic, Calendar as CalendarIcon, Play } from 'lucide-react';
import '../index.css';

const videos = [
  {
    id: "bays4eTXeBI",
    title: "ATMCAST ep#115 | Marco Flores | Reforma Tributária no Aftermarket",
    date: "2026-03-06"
  },
  {
    id: "eVSr5eJTTRY",
    title: "Reforma Tributária em debate no Podcast do Balcão",
    date: "2026-02-27"
  },
  {
    id: "-dtN0c5EhyM",
    title: "COMO TRANSFORMAR DADOS EM ESTRATÉGIA DE NEGÓCIOS | SuporteCast 016",
    date: "2024-12-04"
  },
  {
    id: "7LFHJBPXmCE",
    title: "ATMCAST ep#26 temp. 2 | Marco Flores",
    date: "2023-08-17"
  },
  {
    id: "lPA1FBlPUCg",
    title: "Podcast do BA / MEDIDAS ECONÔMICAS E FINANCEIRAS QUE IRÃO IMPULSIONAR SUAS VENDAS",
    date: "2023-06-02"
  },
  {
    id: "AGbuGV1uAP4",
    title: "Podcast do BA / A Digitalização e a Inteligência Artificial na gestão da reposição",
    date: "2023-02-09"
  },
  {
    id: "ba1pGuUe8Ro",
    title: "Conexão21 - Rodrigo Stallone e Marco Flores",
    date: "2022-05-31"
  },
  {
    id: "jh5euMKEoug",
    title: "Live Balcão Automotivo / Benefícios do uso da inteligência artificial",
    date: "2021-07-15"
  },
  {
    id: "tyEndeEV6z0",
    title: "LIVE | CMP NEWS #008 Perspectivas para o Mercado de Reparação Automotiva",
    date: "2021-04-20"
  },
  {
    id: "QCJCfxZ6ARo",
    title: "Live Balcão Automotivo / O futuro do Mercado de Reposição Automotiva Brasileiro",
    date: "2020-06-26"
  }
];

export default function Midia() {
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '120px' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-tag">Marco Flores</span>
          <h2 className="section-title">Na <span className="highlight">Mídia</span></h2>
          <p className="section-description">
            Acompanhe as participações em podcasts, entrevistas e artigos publicados sobre inteligência tributária e gestão empresarial.
          </p>
        </div>

        {/* Destaque (Vídeo Ativo) */}
        <div className="media-highlight-grid">
          <div className="video-wrapper" style={{ width: '100%' }}>
            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <iframe 
                src={`https://www.youtube.com/embed/${activeVideo.id}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>

          <div className="media-info" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Reproduzindo Agora
            </span>
            <h3 style={{ fontSize: '1.4rem', lineHeight: '1.3' }}>{activeVideo.title}</h3>
            
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <CalendarIcon size={16} className="text-accent" /> <strong>Publicado em:</strong> {formatDate(activeVideo.date)}
              </div>
              <a 
                href={`https://www.youtube.com/watch?v=${activeVideo.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline"
                style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Ver no YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Grade de Histórico */}
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          Mais Participações
        </h3>
        <div className="media-history-grid">
          {videos.filter(v => v.id !== activeVideo.id).map(video => (
            <div 
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              style={{ 
                backgroundColor: 'var(--bg-darker)', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--accent-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000' }}>
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                  alt={video.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Play size={40} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                  <CalendarIcon size={14} /> {formatDate(video.date)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
