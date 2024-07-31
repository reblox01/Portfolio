export const siteConfig = {
    name: "Sohail Koutari - Portfolio",
    description: "Explore the portfolio of Sohail Koutari, a skilled Full-Stack Developer with expertise in React, Next.js, Node.js, and other modern web technologies. Specializing in dynamic web applications, problem-solving, and collaborative projects.",
    logo: {
      url: "/favicon.svg",
      href: "/favicon.svg"
    },
    meta: {
      keywords: "Sohail Koutari, Web Developer, Full-Stack Developer, React, Next.js, Node.js, JavaScript, Portfolio, Front-End Development, Back-End Development, Web Design, Software Engineer, UI/UX, Agile, SEO, Professional, GitHub, Open Source",
      author: "Sohail Koutari",
      viewport: "width=device-width, initial-scale=1",
      "og:title": "Sohail Koutari - Professional Web Developer Portfolio",
      "og:description": "Explore the portfolio of Sohail Koutari, showcasing expertise in modern web technologies and collaborative projects.",
      "og:type": "website",
      "og:url": "https://sohail-koutari.vercel.app/",
      "og:image": "/favicon.svg",
      "twitter:card": "summary_large_image",
      "twitter:title": "Sohail Koutari - Professional Web Developer Portfolio",
      "twitter:description": "Discover the professional web development projects of Sohail Koutari, specializing in React, Next.js, Node.js, and more.",
      "twitter:image": "/favicon.svg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sohail Koutari",
      "url": "https://sohail-koutari.vercel.app/",
      "sameAs": [
        "https://www.linkedin.com/in/sohailkoutari",
        "https://github.com/reblox01",
        "https://gitlab.com/reblox1",
        "https://discord.com/users/684849854010228757",
        "https://buymeacoffee.com/arosck1",
        "https://www.patreon.com/aroscki",
        "https://stackoverflow.com/users/21022067/0x8d",
        "https://www.youtube.com/@aroscki",
        "https://x.com/arosck1",
        "https://instagram.com/aroscki"
      ],
      "jobTitle": "Full-Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "alumniOf": "OFPPT",
      "gender": "Male",
      "image": "/favicon.svg",
      "description": "Sohail Koutari is a professional Full-Stack Developer specializing in React, Next.js, Node.js, and modern web development technologies. With a passion for problem-solving and collaboration, Sohail has worked on various dynamic web projects."
    },
    favicon: {
      light: "/favicon.png",
      dark: "/favicon.svg",
    },
  };
  
  // JavaScript logic to handle dynamic favicon switching
  if (typeof window !== 'undefined') {
    const setFavicon = () => {
      const faviconElement = document.getElementById('favicon') as HTMLLinkElement;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        faviconElement.href = siteConfig.favicon.dark;
      } else {
        faviconElement.href = siteConfig.favicon.light;
      }
    };
  
    // Initial favicon setting
    setFavicon();
  
    // Change favicon on theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);
  }
  