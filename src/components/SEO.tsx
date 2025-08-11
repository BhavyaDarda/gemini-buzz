import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
};

const SEO = ({ title, description, canonical, structuredData }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      const url = canonical.startsWith('http') ? canonical : `${window.location.origin}${canonical}`;
      link.setAttribute('href', url);
    }

    if (structuredData) {
      // Remove existing ld+json we added previously
      const existing = document.getElementById('seo-ld-json');
      if (existing) existing.remove();

      const script = document.createElement('script');
      script.id = 'seo-ld-json';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, structuredData]);

  return null;
};

export default SEO;
