import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url, type = 'website' }) => {
  const siteTitle = "Duniyadari";
  const fullTitle = title === "Home" ? `${siteTitle} - Stories, Jobs & Tools` : `${title} | ${siteTitle}`;
  const defaultImage = "/logo.png"; 
  const siteUrl = window.location.origin;
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : window.location.href;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Duniyadari" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
};

export default SEO;
