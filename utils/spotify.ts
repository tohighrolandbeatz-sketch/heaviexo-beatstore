export function toSpotifyEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://open.spotify.com/playlist/7elgtwyrwOievREEK9kt89?si=UWK12ONARQydnTb9njBfCg`;
    }
    return url;
  } catch {
    return url;
  }
}