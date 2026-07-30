export function toSpotifyEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
    }
    return url;
  } catch {
    return url;
  }
}