import { useEffect, useState } from 'react';
import { get, push, ref, remove } from 'firebase/database';
import { Calendar as CalendarIcon, Clapperboard, Loader, Plus, Search, Trash2, Upload } from 'lucide-react';
import { db } from '../firebase';
import { extractYoutubeId, fetchYoutubeInfo } from '../utils/youtube';
import { normalizeInstagramUrl } from '../utils/instagram';
import Modal from '../components/Modal';
import '../index.css';

const formatDate = (dateString) =>
  new Date(`${dateString}T00:00:00`).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

// Vídeos que já existiam hardcoded no site antes da migração para o Firebase.
// Fica só aqui, para importação única em lote — não é mais usado na página de Mídia.
const LEGACY_VIDEOS = [
  { id: 'S3ZOMWf6lNQ', title: 'REFORMA TRIBUTÁRIA - O IMPACTO NO SETOR AUTOMOTIVO - Podcast Peça & Mecânico #05', date: '2026-09-03' },
  { id: 'wHxpQyVo7zc', title: 'O que mudou na Reforma Tributária em agosto? | Marco Flores | ATMCAST #137', date: '2026-08-06' },
  { id: 'bays4eTXeBI', title: 'ATMCAST ep#115 | Marco Flores | Reforma Tributária no Aftermarket', date: '2026-03-06' },
  { id: 'eVSr5eJTTRY', title: 'Reforma Tributária em debate no Podcast do Balcão', date: '2026-02-27' },
  { id: '-dtN0c5EhyM', title: 'COMO TRANSFORMAR DADOS EM ESTRATÉGIA DE NEGÓCIOS | SuporteCast 016', date: '2024-12-04' },
  { id: '7LFHJBPXmCE', title: 'ATMCAST ep#26 temp. 2 | Marco Flores', date: '2023-08-17' },
  { id: 'lPA1FBlPUCg', title: 'Podcast do BA / MEDIDAS ECONÔMICAS E FINANCEIRAS QUE IRÃO IMPULSIONAR SUAS VENDAS', date: '2023-06-02' },
  { id: 'AGbuGV1uAP4', title: 'Podcast do BA / A Digitalização e a Inteligência Artificial na gestão da reposição', date: '2023-02-09' },
  { id: 'ba1pGuUe8Ro', title: 'Conexão21 - Rodrigo Stallone e Marco Flores', date: '2022-05-31' },
  { id: 'jh5euMKEoug', title: 'Live Balcão Automotivo / Benefícios do uso da inteligência artificial', date: '2021-07-15' },
  { id: 'tyEndeEV6z0', title: 'LIVE | CMP NEWS #008 Perspectivas para o Mercado de Reparação Automotiva', date: '2021-04-20' },
  { id: 'QCJCfxZ6ARo', title: 'Live Balcão Automotivo / O futuro do Mercado de Reposição Automotiva Brasileiro', date: '2020-06-26' },
];

// Reels extraídos do perfil @marcoflores_2d em 30/09/2026, para importação única em lote.
const LEGACY_REELS = [
  'Dd1UcoIi2tY', 'Ddr5llvCtCu', 'DdrQIHIoVF_', 'DdkmlS4CJT7', 'DdWPHsiqWXT',
  'DdE67nfQEpK', 'Dc1etr0CBL2', 'Dcylqh2ssfK', 'DcTePEgBhwZ', 'DcQ1I_yiudj',
  'Db_3QalCoPf', 'Db7-z0pjUl8', 'Db77cERDYsT', 'Db6P2VYDUsN', 'Db4HuKOALy1',
  'Db0Ol8UhQiP', 'DbtexeTi59f', 'DbeAqfZivku', 'DbBK1VGC1LJ', 'Da3quKHi70h',
  'Dalz1sZi_KO', 'DaRHF0uJQPo', 'DaOfNO5BHLM', 'DaOS_MhgdTp', 'DaDU6KEouXo',
  'DaBlmuaCKHo', 'DZvneuXC01K', 'DZY2w3BM8-J', 'DYx9LQQtSgK', 'DYp8AScCocZ',
  'DYn-fiLM4x1', 'DYiCd8qoSO-', 'DYaLs0eplj9', 'DYW6ideCWIk', 'DYVQHNyIenB',
  'DYUl7fjz1Nh', 'DYSiEpGooER', 'DYP7UlFIcKo', 'DYM2FdpCjuD', 'DYHrBWQCT8H',
  'DX-HbgoIMRM', 'DX7lszUEzHy', 'DXhJk-TAoIP', 'DXPWtvsgmHH', 'DXJ_NF7guU9',
  'DXHfHVLCMQq', 'DW_l3BRjqh9', 'DW7YLkujaVM', 'DW6r7mziKTv', 'DWowgdWgtek',
  'DWb6MmyDrA5', 'DWbbt_9jpCL', 'DWYsajljlNZ', 'DWW1G5pCJYD', 'DWQ3yGRDtP6',
  'DWOzARaDNnN', 'DWOXgcohR86', 'DWFbDqrjbTZ', 'DWCaIa7CXXQ', 'DWB5Xl3DWkD',
  'DV_7MBKAjQD', 'DV9SZ21Ae61', 'DV3PzIZgUvH', 'DVyyfvqid9b', 'DVyBvucjiOI',
  'DVuSHchjXIy', 'DVhS2YgDW8M', 'DVbceE6DWDt', 'DVZU3q9D9mD', 'DVO2rsOiQv2',
  'DVMcGSpgUWk', 'DVLUCsiAWhh', 'DVJ_PnSkTBX', 'DVJ8eTmAdQt', 'DVJRDRNDWbv',
  'DVHmjAhkYu-', 'DVGmPLTjbzk', 'DU-zxoFjXbo', 'DU8SFIGjSm_', 'DUiqGPljZOY',
  'DUZD7a0gbNW', 'DUUL_SNDAsK', 'DUSkDa-DgnB', 'DUDfghHjaji', 'DT_MXB-gQY9',
  'DT1JPKQgSlL', 'DTx7FIyDkqD', 'DTxXCl-jk8m', 'DTvv83Sgaap', 'DS9CufvjC7y',
  'DSZ_q2QDUGI', 'DSTZULZDUXT', 'DSFhLc2DTts', 'DRvFL3UAaTG', 'DRmu9EfDV6s',
  'DRe56whjS1Z', 'DQwSkJ0DrZ8', 'DQrY-oYDScP', 'DQpV8cSgbIh', 'DQOzFi0DnSj',
].map((code) => `https://www.instagram.com/reel/${code}/`);

export default function AdminYoutube() {
  const [videos, setVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [urlInput, setUrlInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [modal, setModal] = useState(null);

  const [reels, setReels] = useState([]);
  const [loadingReels, setLoadingReels] = useState(true);
  const [reelUrlInput, setReelUrlInput] = useState('');
  const [reelError, setReelError] = useState('');
  const [savingReel, setSavingReel] = useState(false);
  const [importingReels, setImportingReels] = useState(false);

  const closeModal = () => setModal(null);

  const showAlert = (variant, title, message) => {
    setModal({ variant, title, message, confirmText: 'OK', onConfirm: closeModal });
  };

  const showConfirm = (title, message, onConfirmAction) => {
    setModal({
      variant: 'confirm',
      title,
      message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        closeModal();
        onConfirmAction();
      },
      onCancel: closeModal,
    });
  };

  const loadVideos = async () => {
    setLoadingList(true);
    try {
      const snapshot = await get(ref(db, 'videos'));
      const value = snapshot.val() || {};
      const list = Object.entries(value)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      setVideos(list);
    } catch (err) {
      console.error('Erro ao carregar vídeos:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const loadReels = async () => {
    setLoadingReels(true);
    try {
      const snapshot = await get(ref(db, 'reels'));
      const value = snapshot.val() || {};
      setReels(Object.entries(value).map(([key, data]) => ({ key, ...data })));
    } catch (err) {
      console.error('Erro ao carregar reels:', err);
    } finally {
      setLoadingReels(false);
    }
  };

  useEffect(() => {
    loadVideos();
    loadReels();
  }, []);

  const handleAddReel = async (e) => {
    e.preventDefault();
    setReelError('');

    const normalizedUrl = normalizeInstagramUrl(reelUrlInput);
    if (!normalizedUrl) {
      setReelError('Link do Instagram inválido. Use o link de um post ou reel público.');
      return;
    }
    if (reels.some((r) => r.url === normalizedUrl)) {
      setReelError('Esse reel já está cadastrado.');
      return;
    }

    setSavingReel(true);
    try {
      await push(ref(db, 'reels'), { url: normalizedUrl });
      setReelUrlInput('');
      loadReels();
      showAlert('success', 'Reel adicionado', 'O reel já está disponível na página de Mídia.');
    } catch (err) {
      console.error(err);
      showAlert('error', 'Erro ao salvar', 'Não foi possível adicionar o reel. Tente novamente.');
    } finally {
      setSavingReel(false);
    }
  };

  const handleDeleteReel = (reel) => {
    showConfirm(
      'Remover reel',
      'Remover este reel da lista de mídia?',
      async () => {
        try {
          await remove(ref(db, `reels/${reel.key}`));
          setReels((prev) => prev.filter((r) => r.key !== reel.key));
        } catch (err) {
          console.error(err);
          showAlert('error', 'Erro ao remover', 'Não foi possível remover o reel. Tente novamente.');
        }
      }
    );
  };

  const handleImportLegacyReels = () => {
    const novos = LEGACY_REELS.filter((url) => !reels.some((r) => r.url === url));
    if (novos.length === 0) {
      showAlert('success', 'Nada a importar', 'Todos esses reels já estão cadastrados.');
      return;
    }
    showConfirm(
      'Importar reels antigos',
      `Importar ${novos.length} reels do perfil @marcoflores_2d?`,
      async () => {
        setImportingReels(true);
        try {
          for (const url of novos) {
            await push(ref(db, 'reels'), { url });
          }
          await loadReels();
          showAlert('success', 'Importação concluída', `${novos.length} reels foram importados.`);
        } catch (err) {
          console.error(err);
          showAlert('error', 'Erro ao importar', 'Não foi possível importar os reels. Tente novamente.');
        } finally {
          setImportingReels(false);
        }
      }
    );
  };

  const handleFetchInfo = async () => {
    setFormError('');
    setPreview(null);
    const videoId = extractYoutubeId(urlInput);
    if (!videoId) {
      setFormError('Link do YouTube inválido.');
      return;
    }
    if (videos.some((v) => v.id === videoId)) {
      setFormError('Esse vídeo já está cadastrado.');
      return;
    }
    setFetchingInfo(true);
    try {
      const info = await fetchYoutubeInfo(videoId);
      setPreview({ id: videoId, ...info });
    } catch (err) {
      console.error(err);
      setFormError('Não foi possível buscar o vídeo. Confira o link e tente novamente.');
    } finally {
      setFetchingInfo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!preview) {
      setFormError('Busque o vídeo pelo link antes de adicionar.');
      return;
    }

    setSaving(true);
    try {
      await push(ref(db, 'videos'), preview);
      setUrlInput('');
      setPreview(null);
      loadVideos();
      showAlert('success', 'Vídeo adicionado', 'O vídeo já está disponível na página de Mídia.');
    } catch (err) {
      console.error(err);
      showAlert('error', 'Erro ao salvar', 'Não foi possível adicionar o vídeo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleImportLegacy = () => {
    showConfirm(
      'Importar vídeos antigos',
      `Importar os ${LEGACY_VIDEOS.length} vídeos que já existiam no site?`,
      async () => {
        setImporting(true);
        try {
          for (const video of LEGACY_VIDEOS) {
            await push(ref(db, 'videos'), video);
          }
          await loadVideos();
          showAlert('success', 'Importação concluída', `${LEGACY_VIDEOS.length} vídeos foram importados.`);
        } catch (err) {
          console.error(err);
          showAlert('error', 'Erro ao importar', 'Não foi possível importar os vídeos antigos. Tente novamente.');
        } finally {
          setImporting(false);
        }
      }
    );
  };

  const handleDelete = (video) => {
    showConfirm(
      'Remover vídeo',
      `Remover "${video.title}" da lista de mídia?`,
      async () => {
        try {
          await remove(ref(db, `videos/${video.key}`));
          setVideos((prev) => prev.filter((v) => v.key !== video.key));
        } catch (err) {
          console.error(err);
          showAlert('error', 'Erro ao remover', 'Não foi possível remover o vídeo. Tente novamente.');
        }
      }
    );
  };

  return (
    <div className="section" style={{ minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <h2 style={{ marginBottom: '2rem' }}>Vídeos da página <span className="highlight">Mídia</span></h2>

        <div className="contact-form-container" style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Adicionar novo vídeo</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="video-url">Link do YouTube</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  id="video-url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setPreview(null);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleFetchInfo}
                  disabled={fetchingInfo || !urlInput}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
                >
                  {fetchingInfo ? <Loader className="spin" size={16} /> : <Search size={16} />}
                  Buscar vídeo
                </button>
              </div>
            </div>

            {preview && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${preview.id}/default.jpg`}
                  alt={preview.title}
                  style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{preview.title}</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CalendarIcon size={13} /> {formatDate(preview.date)}
                  </p>
                </div>
              </div>
            )}

            {formError && <p style={{ color: '#e05c5c', fontSize: '0.9rem', marginBottom: '1rem' }}>{formError}</p>}

            <button type="submit" className="btn btn-primary" disabled={saving || !preview}>
              {saving ? 'Salvando...' : 'Adicionar vídeo'}
            </button>
          </form>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Vídeos cadastrados ({videos.length})</h3>
        {loadingList ? (
          <Loader className="spin text-accent" size={24} />
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
              Nenhum vídeo cadastrado ainda. Você pode importar de uma vez os {LEGACY_VIDEOS.length} vídeos que já existiam no site.
            </p>
            <button
              className="btn btn-outline"
              onClick={handleImportLegacy}
              disabled={importing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {importing ? <Loader className="spin" size={16} /> : <Upload size={16} />}
              {importing ? 'Importando...' : `Importar ${LEGACY_VIDEOS.length} vídeos antigos`}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {videos.map((video) => (
              <div
                key={video.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                  alt={video.title}
                  style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {video.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{video.date}</p>
                </div>
                <button
                  onClick={() => handleDelete(video)}
                  aria-label="Remover vídeo"
                  style={{ background: 'none', border: 'none', color: '#e05c5c', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="contact-form-container" style={{ margin: '3rem 0' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clapperboard size={20} /> Adicionar reel do Instagram
          </h3>
          <form onSubmit={handleAddReel}>
            <div className="form-group">
              <label htmlFor="reel-url">Link do post ou reel (precisa ser de uma conta pública)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  id="reel-url"
                  type="text"
                  placeholder="https://www.instagram.com/reel/..."
                  value={reelUrlInput}
                  onChange={(e) => setReelUrlInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingReel || !reelUrlInput}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
                >
                  {savingReel ? <Loader className="spin" size={16} /> : <Plus size={16} />}
                  Adicionar
                </button>
              </div>
            </div>
            {reelError && <p style={{ color: '#e05c5c', fontSize: '0.9rem', margin: 0 }}>{reelError}</p>}
          </form>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Reels cadastrados ({reels.length})</h3>
          <button
            className="btn btn-outline"
            onClick={handleImportLegacyReels}
            disabled={importingReels}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            {importingReels ? <Loader className="spin" size={16} /> : <Upload size={16} />}
            {importingReels ? 'Importando...' : `Importar ${LEGACY_REELS.length} reels antigos`}
          </button>
        </div>
        {loadingReels ? (
          <Loader className="spin text-accent" size={24} />
        ) : reels.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Nenhum reel cadastrado ainda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reels.map((reel) => (
              <div
                key={reel.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                }}
              >
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 0, color: 'var(--accent-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {reel.url}
                </a>
                <button
                  onClick={() => handleDeleteReel(reel)}
                  aria-label="Remover reel"
                  style={{ background: 'none', border: 'none', color: '#e05c5c', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={Boolean(modal)} {...modal} />
    </div>
  );
}
