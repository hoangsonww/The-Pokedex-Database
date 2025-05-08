import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * A layout component that wraps the main content of our app.
 */
type LayoutProps = {
  children: ReactNode;
};

/**
 * The layout component
 *
 * @param param0 The props for the layout component
 * @returns The layout component
 */
export default function Layout({ children }: LayoutProps) {
  return (
    // Each page will be wrapped in this layout component
    // A layout contains: A Navbar, the main content (e.g. the list of pokemons and items, the item details page, etc.), and a Footer
    // The Navbar and Footer are shared across all pages
    // The main content will be different for each page
    // The children prop is a ReactNode, which means it can be any valid JSX element
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
