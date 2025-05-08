// Wrapping the app with the QueryClientProvider to provide the query client to all pages
// (As described in the assignment reading)
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import motion and AnimatePresence from framer-motion for page transitions (I'M A BIG FAN OF FRAMER MOTION! 😍)
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Head from 'next/head';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  // Use the router to get the current path
  const router = useRouter();

  // Each page transition will be animated -- for a smoother ui/ux
  // Each page will contain a layout component with a Navbar, the main content, and a Footer
  return (
    <QueryClientProvider client={queryClient}>
      {/* Here I'm using the Head component from next/head to set the metadata for the app */}
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ec4899" />
        <title>Pokédex - Explore Pokémon</title>
        <meta
          name="description"
          content="A Pokédex app built with Next.js and PokeAPI for COMP-426 at UNC."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
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
          className="font-sans">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </motion.div>
      </AnimatePresence>
    </QueryClientProvider>
  );
}
