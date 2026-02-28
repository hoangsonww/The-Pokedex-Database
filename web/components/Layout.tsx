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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.18),transparent_60%)]" />
      <Navbar />
      <main className="relative z-10 mx-auto flex-1 w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
