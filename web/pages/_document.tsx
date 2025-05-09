import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';

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
          <meta
            name="description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta name="theme-color" content="#ec4899" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://pokedex-db.vercel.app/" />
          <meta property="og:title" content="Pokédex Database" />
          <meta
            property="og:description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta
            property="og:image"
            content="https://pokedex-db.vercel.app/images/pokedex-app.png"
          />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://pokedex-db.vercel.app/" />
          <meta name="twitter:title" content="Pokédex Database" />
          <meta
            name="twitter:description"
            content="Explore Pokémon & items with search, pagination, and favorites. Pokédex Database built with Next.js, React Query & Tailwind CSS."
          />
          <meta
            name="twitter:image"
            content="https://pokedex-db.vercel.app/images/pokedex-app.png"
          />

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
