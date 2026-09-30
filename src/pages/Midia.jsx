import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Play, Loader, AlertCircle, Clapperboard } from 'lucide-react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import '../index.css';

export default function Midia() {
  const [videos, setVideos] = useState([]);
  const [reels, setReels] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // { type: 'video', ...video } | { type: 'reel', ...reel }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reelsVisible, setReelsVisible] = useState(6);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [videosSnap, reelsSnap] = await Promise.all([
          get(ref(db, 'videos')),
          get(ref(db, 'reels')),
        ]);

        const videosValue = videosSnap.val() || {};
        const videoList = Object.entries(videosValue)
          .map(([key, data]) => ({ key, ...data }))
          .sort((a, b) => (a.date < b.date ? 1 : -1));
        setVideos(videoList);

        const reelsValue = reelsSnap.val() || {};
        const reelList = Object.entries(reelsValue).map(([key, data]) => ({ key, ...data }));
        setReels(reelList);

        if (videoList.length > 0) setActiveItem({ type: 'video', ...videoList[0] });
        else if (reelList.length > 0) setActiveItem({ type: 'reel', ...reelList[0] });
      } catch (err) {
        console.error('Erro ao buscar mídia:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const selectItem = (item) => {
    setActiveItem(item);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const getReelThumbnail = (url) => {
    const match = url.match(/\/(reel|p|tv)\/([\w-]+)\/?/);
    return match ? `/reels/${match[2]}.jpg` : null;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const otherVideos = videos.filter((v) => !(activeItem?.type === 'video' && activeItem.id === v.id));
  const otherReels = reels.filter((r) => !(activeItem?.type === 'reel' && activeItem.key === r.key));
  const visibleReels = isMobile ? otherReels.slice(0, reelsVisible) : otherReels;
  const hasMoreReels = isMobile && reelsVisible < otherReels.length;

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

        {loading ? (
          <div className="events-status">
            <Loader className="spin text-accent" size={40} />
            <p>Carregando vídeos...</p>
          </div>
        ) : error ? (
          <div className="events-status">
            <AlertCircle className="text-muted" size={40} />
            <p>Não foi possível carregar os vídeos agora. Tente novamente mais tarde.</p>
          </div>
        ) : videos.length === 0 && reels.length === 0 ? (
          <div className="events-status">
            <CalendarIcon className="text-muted" size={40} />
            <p>Em breve novos conteúdos por aqui.</p>
          </div>
        ) : (
          <>
            {/* Destaque — largura total, aceita vídeo ou reel */}
            {activeItem && (
              <div className="media-highlight-grid" style={activeItem.type === 'reel' ? { alignItems: 'start' } : undefined}>
                <div className="video-wrapper" style={{ width: '100%' }}>
                  {activeItem.type === 'video' ? (
                    <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${activeItem.id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      ></iframe>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: '260px', height: '380px', borderRadius: '12px', overflow: 'hidden', background: '#000', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        <iframe
                          key={activeItem.url}
                          src={`${activeItem.url}embed`}
                          title="Instagram reel player"
                          frameBorder="0"
                          scrolling="no"
                          allow="encrypted-media; picture-in-picture"
                          allowFullScreen
                          style={{ position: 'absolute', top: 0, left: 0, width: '260px', height: '580px', border: 0 }}
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>

                <div className="media-info" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Reproduzindo Agora
                  </span>
                  <h3 style={{ fontSize: '1.4rem', lineHeight: '1.3' }}>
                    {activeItem.type === 'video' ? activeItem.title : 'Reel do Instagram'}
                  </h3>

                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activeItem.type === 'video' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        <CalendarIcon size={16} className="text-accent" /> <strong>Publicado em:</strong> {formatDate(activeItem.date)}
                      </div>
                    )}
                    <a
                      href={activeItem.type === 'video' ? `https://www.youtube.com/watch?v=${activeItem.id}` : activeItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      {activeItem.type === 'video' ? 'Ver no YouTube' : 'Ver no Instagram'}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {(otherReels.length > 0 || otherVideos.length > 0) && (
              <div className={otherReels.length > 0 && otherVideos.length > 0 ? 'media-split' : ''}>
                {otherReels.length > 0 && (
                  <div className="media-split-col">
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                      Reels
                    </h3>
                    <div className={`media-reels-grid${isMobile ? '' : ' media-scroll-area'}`}>
                      {visibleReels.map((reel) => {
                        const thumbnail = getReelThumbnail(reel.url);
                        return (
                          <button
                            key={reel.key}
                            type="button"
                            onClick={() => selectItem({ type: 'reel', ...reel })}
                            style={{
                              position: 'relative',
                              display: 'block',
                              width: '100%',
                              paddingTop: 0,
                              paddingLeft: 0,
                              paddingRight: 0,
                              paddingBottom: '125%',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'radial-gradient(circle at 50% 40%, rgba(var(--accent-color-rgb, 200,150,60), 0.18), transparent 60%), linear-gradient(160deg, var(--bg-darker), #000)',
                              transition: 'transform 0.2s ease, border-color 0.2s ease',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.borderColor = 'var(--accent-color)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                          >
                            {thumbnail && (
                              <img
                                src={thumbnail}
                                alt=""
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                            <Clapperboard
                              size={90}
                              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.05)', zIndex: 0 }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1.5px solid rgba(255,255,255,0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(2px)',
                                zIndex: 1,
                              }}
                            >
                              <Play size={26} color="white" style={{ marginLeft: '3px' }} />
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '0.6rem 0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '0.8rem',
                                zIndex: 1,
                              }}
                            >
                              <Clapperboard size={14} /> Reel
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {hasMoreReels && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setReelsVisible((n) => n + 6)}
                        style={{ display: 'block', margin: '1.25rem auto 0', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        Mostrar mais
                      </button>
                    )}
                  </div>
                )}

                {otherVideos.length > 0 && (
                  <div className="media-split-col">
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                      Mais Participações
                    </h3>
                    <div className="media-history-grid media-scroll-area">
                      {otherVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => selectItem({ type: 'video', ...video })}
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
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
