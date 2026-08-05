import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

export const SeoHead = ({
  title = "ShowOff4U - Technical Knowledge Sharing & Developer Hub",
  description = "ShowOff4U is a high-performance publishing platform for developers, creators, and teachers to document breakthroughs and showcase project portfolios.",
  image = "https://www.showoff4u.in/og-image.webp",
  url = "https://www.showoff4u.in/",
  type = "website",
  articleData,
}: SeoHeadProps) => {
  const fullTitle = title.includes("ShowOff4U") ? title : `${title} | ShowOff4U`;

  const schemaData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": [image],
    "datePublished": articleData?.publishedTime || new Date().toISOString(),
    "dateModified": articleData?.modifiedTime || articleData?.publishedTime || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": articleData?.author || "ShowOff4U Creator",
      "url": `https://www.showoff4u.in/user/${articleData?.author || ''}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShowOff4U",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.showoff4u.in/logo.webp"
      }
    },
    "description": description
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
