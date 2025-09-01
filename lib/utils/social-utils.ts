// Utility functions for handling social media links

// Extract a username/handle from a URL or raw input
export function normalizeHandle(value?: string | null): string | null {
  if (!value) return null
  let v = value.trim()
  if (!v) return null
  // remove protocol and www
  v = v.replace(/^https?:\/\//i, "").replace(/^www\./i, "")
  // remove domain for common sites
  const hosts = [
    "github.com/",
    "linkedin.com/in/",
    "linkedin.com/",
    "facebook.com/",
    "instagram.com/",
    "discord.com/users/",
    "discordapp.com/users/",
    "gitlab.com/",
    "twitter.com/",
    "x.com/",
    "youtube.com/@",
    "youtube.com/",
  ]
  for (const h of hosts) {
    if (v.toLowerCase().startsWith(h)) {
      v = v.slice(h.length)
      break
    }
  }
  // if path-like, take last segment
  if (v.includes("/")) v = v.split("/").filter(Boolean).pop() || v
  // trim leading @
  v = v.replace(/^@+/, "")
  return v
}

// Convert a social network and handle to a full URL
export function socialUrl(network: string, handle?: string | null): string | undefined {
  const raw = normalizeHandle(handle);
  if (!raw) return undefined;
  const h = raw.replace(/^@+/, "");
  switch (network) {
    case "github": return `https://github.com/${h}`;
    case "linkedIn": return `https://linkedin.com/in/${h}`;
    case "facebook": return `https://facebook.com/${h}`;
    case "instagram": return `https://instagram.com/${h}`;
    case "discord": return `https://discord.com/users/${h}`;
    case "gitlab": return `https://gitlab.com/${h}`;
    case "twitter": return `https://twitter.com/${h}`;
    case "youtube": return `https://youtube.com/@${h}`;
    case "whatsapp": return `https://wa.me/${h}`;
    default: return undefined;
  }
}

// Add protocol to URL if missing
export function withProtocol(url?: string | null): string | undefined {
  return url ? (url.startsWith("http") ? url : `https://${url}`) : undefined;
}
