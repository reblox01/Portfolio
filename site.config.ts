// Define your core values in variables for quick Setup
const YOUR_NAME = "<Your Name>";
const YOUR_POSITION = "<Your Job position>";
const YOUR_UNIVERSITY = "<Your University>";
const YOUR_GENDER = "<Your Gender>"; // Optional: Delete or leave blank if you prefer not to specify
const YOUR_SITE_URL = "https://yourdomain.com"; // Update this with your actual site URL

export const siteConfig = {
  name: `${YOUR_NAME} - Portfolio`,
  description: `Explore the portfolio of ${YOUR_NAME}, a skilled ${YOUR_POSITION} with expertise in React, Next.js, Node.js, and other modern web technologies. Specializing in dynamic web applications, problem-solving, and collaborative projects, ... <Your Own Description>`,
  logo: {
    url: "/favicon-dark.svg", // Fallback logo if needed
    href: "/favicon-dark.svg" // Fallback href if needed
  },
  meta: {
    keywords: `${YOUR_NAME}, <Your other keywords>, Web Developer, ${YOUR_POSITION}, React, Next.js, Node.js, JavaScript, Portfolio, Front-End Development, Back-End Development, Web Design, Software Engineer, UI/UX, Agile, SEO, Professional, GitHub, Open Source`,
    author: YOUR_NAME,
    viewport: "width=device-width, initial-scale=1",
    "og:title": `${YOUR_NAME} - ${YOUR_POSITION}`,
    "og:description": `Explore the portfolio of ${YOUR_NAME}, showcasing expertise in modern web technologies and collaborative projects.`,
    "og:type": "website",
    "og:url": YOUR_SITE_URL,
    "og:image": "/favicon-dark.svg",
    "twitter:card": "summary_large_image",
    "twitter:title": `${YOUR_NAME} - ${YOUR_POSITION}`,
    "twitter:description": `Discover the professional web development projects of ${YOUR_NAME}, specializing in React, Next.js, Node.js, and more.`,
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
    "description": `${YOUR_NAME} is a professional ${YOUR_POSITION} specializing in React, Next.js, Node.js, and modern web development technologies. With a passion for problem-solving and collaboration, ${YOUR_NAME} has worked on various dynamic web projects.`
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
