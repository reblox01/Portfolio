// Define your core values in variables for quick Setup
const YOUR_NAME = "<Your Name>";
const YOUR_POSITION = "<Your Job position>";
const YOUR_UNIVERSITY = "<Your University>";
const YOUR_SKILLS = "<Your Skills>, <Your Skills>, <Your Skills>";
const YOUR_INTRODUCTION = "<Your Introduction>";
const YOUR_GENDER = "<Your Gender>"; // Optional: Delete or leave blank if you prefer not to specify
const YOUR_SITE_URL = "https://yourdomain.com"; // Update this with your actual site URL

export const siteConfig = {
  name: `${YOUR_NAME} - Portfolio`,
  description: `${YOUR_INTRODUCTION}, Specializing in ${YOUR_SKILLS}`,
  logo: {
    url: "/favicon-dark.svg", // Fallback logo if needed
    href: "/favicon-dark.svg" // Fallback href if needed
  },
  meta: {
    keywords: `${YOUR_NAME}, <Your other keywords>, ${YOUR_POSITION}, ${YOUR_SKILLS}, ${YOUR_UNIVERSITY}, ${YOUR_GENDER}, ${YOUR_SITE_URL}`,
    author: YOUR_NAME,
    viewport: "width=device-width, initial-scale=1",
    "og:title": `${YOUR_NAME} - ${YOUR_POSITION}`,
    "og:description": `${YOUR_INTRODUCTION}`,
    "og:type": "website",
    "og:url": YOUR_SITE_URL,
    "og:image": "/favicon-dark.svg",
    "twitter:card": "summary_large_image",
    "twitter:title": `${YOUR_NAME} - ${YOUR_POSITION}`,
    "twitter:description": `${YOUR_INTRODUCTION}, Specializing in ${YOUR_SKILLS}`,
    "twitter:image": "/favicon-dark.svg"
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": YOUR_NAME,
    "url": YOUR_SITE_URL,
    "sameAs": [
      "https://www.linkedin.com/in/Your-Namei",
      "https://github.com/your-username",
      "https://gitlab.com/your-username",
      "https://discord.com/users/your-id",
      "https://buymeacoffee.com/your-username",
      "https://www.patreon.com/your-username",
      "https://stackoverflow.com/users/your-id",
      "https://www.youtube.com/@your-username",
      "https://x.com/your-username",
      "https://instagram.com/your-username",
      "<Your other links>"
    ],
    "jobTitle": YOUR_POSITION,
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "alumniOf": YOUR_UNIVERSITY,
    // Optional: Delete or leave blank if you prefer not to specify your gender
    "gender": YOUR_GENDER,
    "image": "/favicon-dark.svg",
    "description": `${YOUR_INTRODUCTION}, Specializing in ${YOUR_SKILLS}`
  },
  favicon: {
    light: "/favicon-light.svg",
    dark: "/favicon-dark.svg",
  },
};

// JavaScript logic to handle dynamic favicon switching
if (typeof window !== 'undefined') {
  const setFavicon = () => {
    const faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (faviconElement) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        faviconElement.href = siteConfig.favicon.dark;
      } else {
        faviconElement.href = siteConfig.favicon.light;
      }
    }
  };
setFavicon();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);
}
