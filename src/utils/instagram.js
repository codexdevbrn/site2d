// Valida e normaliza um link de post/reel do Instagram (aceita reel, p e tv).
export function normalizeInstagramUrl(input) {
  if (!input) return null;
  const trimmed = input.trim();
  const match = trimmed.match(/^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/([\w-]+)\/?/);
  if (!match) return null;
  return `https://www.instagram.com/${match[2]}/${match[3]}/`;
}
