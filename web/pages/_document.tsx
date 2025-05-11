import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Poppins font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* Primary metadata */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="author" content="Son Nguyen" />
          <meta
            name="description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta
            name="keywords"
            content="Pokédex, Pokémon, Next.js, React Query, Tailwind CSS, Pokedex Database"
          />
          <meta name="theme-color" content="#ec4899" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://pokedex-db.vercel.app/" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:url" content="https://pokedex-db.vercel.app/" />
          <meta property="og:title" content="Pokédex Database" />
          <meta
            property="og:description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta
            property="og:image"
            content="https://pokedex-db.vercel.app/android-chrome-512x512.png"
          />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@hoangsonww" />
          <meta name="twitter:creator" content="@hoangsonww" />
          <meta name="twitter:title" content="Pokédex Database" />
          <meta
            name="twitter:description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta
            name="twitter:image"
            content="https://pokedex-db.vercel.app/android-chrome-512x512.png"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                url: 'https://pokedex-db.vercel.app/',
                name: 'Pokédex Database',
                author: {
                  '@type': 'Person',
                  name: 'Son Nguyen',
                  url: 'https://github.com/hoangsonww'
                }
              })
            }}
          />

          {/* Google Analytics via next/script */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-3HYFFXTYEK"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3HYFFXTYEK', {
                page_path: window.location.pathname,
              });
            `}
          </Script>

          {/* PWA manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* Favicons */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body
          className="
            bg-lightBg dark:bg-darkBg
            text-gray-800 dark:text-gray-100
            transition-colors duration-300
          ">
          <Main />
          <Analytics />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
