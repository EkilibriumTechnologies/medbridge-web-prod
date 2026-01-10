import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// SEO elements that can be used in _document.tsx (returns JSX without Head wrapper)
export function SEOElements({
  title = "Hello World",
  description = "Welcome to my app",
  image = "/og-image.png",
  url,
}: SEOProps) {
  // Use relative paths for Capacitor builds to avoid issues with http://localhost/
  // process.env.CAPACITOR_BUILD is available at build time in _document.tsx
  const faviconPath = process.env.CAPACITOR_BUILD === "true" ? "./favicon.ico" : "/favicon.ico";
  const imagePath = process.env.CAPACITOR_BUILD === "true" ? (image.startsWith("/") ? `.${image}` : image) : image;
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={faviconPath} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={imagePath} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={imagePath} />}

      {/* Viewport and mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}

// Default SEO component for use in pages/_app.tsx or individual pages (uses next/head)
export default function SEO(props: SEOProps) {
  return (
    <Head>
      <SEOElements {...props} />
    </Head>
  );
}
