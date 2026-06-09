// Short, stable, URL-safe code for a Notion job id, so share links stay tidy
// (…/?j=k3p9x&a=zen instead of a 36-char UUID). Notion ids share long common
// prefixes (pages created in the same batch), so truncating them collides —
// hashing distributes them uniformly. Must be computed identically on the
// client (ShareButton) and the server (generateMetadata) so the codes match.
export function jobCode(id: string): string {
  // FNV-1a 32-bit.
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
