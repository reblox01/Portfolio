export const siteConfig = {
    name: "Your Name - Portfolio",
    description: "Explore the portfolio of Sohail Koutari, a skilled Full-Stack Developer with expertise in React, Next.js, Node.js, and other modern web technologies. Specializing in dynamic web applications, problem-solving, and collaborative projects.",
    logo: {
      url: "/favicon-dark.svg", // Fallback logo if needed
      href: "/favicon-dark.svg"  // Fallback href if needed
    },
    meta: {
      keywords: "Your Name, Your other keywords, Web Developer, Full-Stack Developer, React, Next.js, Node.js, JavaScript, Portfolio, Front-End Development, Back-End Development, Web Design, Software Engineer, UI/UX, Agile, SEO, Professional, GitHub, Open Source",
      author: "Your Name",
      viewport: "width=device-width, initial-scale=1",
      "og:title": "Your Name - Professional Web Developer Portfolio",
      "og:description": "Explore the portfolio of Sohail Koutari, showcasing expertise in modern web technologies and collaborative projects.",
      "og:type": "website",
      "og:url": "https://Your-Name.vercel.app/",
      "og:image": "/favicon-dark.svg",
      "twitter:card": "summary_large_image",
      "twitter:title": "Your Name - Professional Web Developer Portfolio",
      "twitter:description": "Discover the professional web development projects of Your Name, specializing in React, Next.js, Node.js, and more.",
      "twitter:image": "/favicon-dark.svg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Your Name",
      "url": "https://Your-Name.vercel.app/",
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
        "your other links"
      ],
      "jobTitle": "Your Job position",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "alumniOf": "Your University",
      "gender": "Your Gender",
      "image": "/favicon-dark.svg",
      "description": "Your Name is a professional Full-Stack Developer specializing in React, Next.js, Node.js, and modern web development technologies. With a passion for problem-solving and collaboration, Sohail has worked on various dynamic web projects."
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
  
    // Initial favicon setting
    setFavicon();
  
    // Change favicon on theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);
  }
  
