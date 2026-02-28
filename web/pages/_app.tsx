// Wrapping the app with the QueryClientProvider to provide the query client to all pages
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import motion and AnimatePresence from framer-motion for page transitions (I'M A BIG FAN OF FRAMER MOTION! 😍)
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { Poppins, Space_Grotesk } from 'next/font/google';

const queryClient = new QueryClient();
const bodyFont = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});
const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700']
});

export default function App({ Component, pageProps }: AppProps) {
  // Use the router to get the current path
  const router = useRouter();

  // Each page transition will be animated -- for a smoother ui/ux
  // Each page will contain a layout component with a Navbar, the main content, and a Footer
  return (
    <QueryClientProvider client={queryClient}>
      {/* Here I'm using the Head component from next/head to set the metadata for the app */}
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <title>Pokédex – Explore Pokémon</title>
        <meta
          name="description"
          content="A Pokédex app built with Next.js and PokeAPI for exploring Pokémon and items."
        />
        <meta name="author" content="Your Name or Team" />
        <meta
          name="keywords"
          content="Pokédex, Pokémon, Next.js, PokeAPI, explore, catch, items"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ec4899" />

        {/* Favicon & App Icons */}
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pokedex-db.vercel.app/" />
        <meta property="og:title" content="Pokédex – Explore Pokémon" />
        <meta property="og:site_name" content="Pokédex" />
        <meta
          property="og:description"
          content="A Pokédex app built with Next.js and PokeAPI for exploring Pokémon and items."
        />
        <meta
          property="og:image"
          content="https://pokedex-db.vercel.app/android-chrome-512x512.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hoangsonwww" />
        <meta name="twitter:creator" content="@hoangsonwww" />
        <meta name="twitter:title" content="Pokédex – Explore Pokémon" />
        <meta
          name="twitter:description"
          content="A Pokédex app built with Next.js and PokeAPI for exploring Pokémon and items."
        />
        <meta
          name="twitter:image"
          content="https://pokedex-db.vercel.app/android-chrome-512x512.png"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://pokedex-db.vercel.app/" />
      </Head>

      {/* AnimatePresence is used to animate the page transitions, using wait mode to wait for the exit animation to finish before rendering the new page */}
      <AnimatePresence mode="wait">
        {/* Using the router path as a key for page transitions, so that the page transitions are triggered when the path changes */}
        {/* Basically, this motion div will behave as follows: 
            - When a new page is loaded, it will fade in from the top
            - When a page is exited, it will fade out to the top 
            - The transition duration is 0.4 seconds
        */}
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.4 }}
          className={`${bodyFont.variable} ${displayFont.variable} font-sans`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </motion.div>
      </AnimatePresence>

      <Analytics />
    </QueryClientProvider>
  );
}
