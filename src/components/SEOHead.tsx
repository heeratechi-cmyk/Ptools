import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_DOMAIN, SITE_NAME } from '../data/seoData';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  schema?: Record<string, any>;
}

export default function SEOHead({
  title,
  description,
  path,
  type = 'website',
  schema,
}: SEOHeadProps) {
  const canonicalUrl = `${SITE_DOMAIN}${path.startsWith('/') ? path : `/${path}`}`;

  // Keep DOM elements directly updated for instant hydration & crawlers
  React.useEffect(() => {
    document.title = title;
    
    const setMeta = (nameOrProperty: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${nameOrProperty}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameOrProperty, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalUrl]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={`${SITE_DOMAIN}/logo.png`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_DOMAIN}/logo.png`} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
