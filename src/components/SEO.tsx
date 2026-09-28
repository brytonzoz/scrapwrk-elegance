import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
}

const SEO = ({ 
  title = "ScrapWRK by Bryton Zoz | Sustainable Fashion from Scraps",
  description = "ScrapWRK by Bryton Zoz transforms textile scraps into one-of-a-kind sustainable fashion pieces. Designed for those sustainably living in tomorrow.",
  canonicalUrl = "https://scrapwrk.web.app",
  ogType = "website",
  ogImage = "/og-image.jpg",
  keywords = "Bryton Zoz, ScrapWRK, sustainable fashion, upcycled clothing, textile scraps, fashion design, Bryton, Zoz"
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bryton Zoz" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ScrapWRK by Bryton Zoz" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="google-site-verification" content="your-verification-code" />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ScrapWRK by Bryton Zoz",
            "url": "${canonicalUrl}",
            "description": "${description}",
            "author": {
              "@type": "Person",
              "name": "Bryton Zoz"
            },
            "mainEntity": {
              "@type": "Organization",
              "name": "ScrapWRK",
              "founder": "Bryton Zoz",
              "description": "Sustainable fashion brand transforming textile scraps into one-of-a-kind pieces"
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO; 