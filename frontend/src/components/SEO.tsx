import { Helmet } from "react-helmet-async";
import React from "react";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  jsonLd?: Record<string, any>;
  image?: string;
};

const SEO: React.FC<SEOProps> = ({ title, description, path = "/", jsonLd, image }) => {
  const canonical = typeof window !== "undefined" ? new URL(path, window.location.origin).toString() : path;
  const ogImage = image || "https://lovable.dev/opengraph-image-p98pqg.png";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
