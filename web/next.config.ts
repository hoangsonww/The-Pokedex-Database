import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  /* ensure that pokemon images can load */
  /* adding unoptimized: true to the images object will allow the images to load */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/**'
      }
    ],
    unoptimized: true
  }
};

// Enable PWA support (I'm experimenting with this feature just for fun)
export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true
  // @ts-expect-error Our app still works with this
})(nextConfig);
