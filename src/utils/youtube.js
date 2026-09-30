// Extrai o ID de um vídeo a partir de qualquer formato de link do YouTube
// (watch?v=, youtu.be/, embed/, shorts/) ou aceita o ID puro se já vier assim.
export function extractYoutubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  // Já é um ID puro (11 caracteres, letras/números/-/_)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

// Busca título e data de publicação via API oficial do YouTube (YouTube Data API v3).
// Precisa da API habilitada no projeto do Google associado à chave.
export async function fetchYoutubeInfo(videoId) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('VITE_YOUTUBE_API_KEY não configurada.');

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Não foi possível buscar informações desse vídeo.');

  const data = await response.json();
  const item = data.items?.[0];
  if (!item) throw new Error('Vídeo não encontrado.');

  return {
    title: item.snippet.title,
    date: item.snippet.publishedAt.slice(0, 10),
  };
}
