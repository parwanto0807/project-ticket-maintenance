import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Nonaktifkan cache saat development
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/your-api-url\.com\/.*$/, // Sesuaikan dengan API yang ingin dicache
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 hari
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
        },
      },
    },
  ],
});

const nextConfig = withPWA({
  images: {
    domains: [
      "https://solusiit.net", // 🔥 Ganti dengan domain VPS Anda
      "https://2pwk5zmnkgubtogq.public.blob.vercel-storage.com", // 🔥 Jika menggunakan storage Vercel
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "2pwk5zmnkgubtogq.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "solusiit.net",
      }
    ],
    minimumCacheTTL: 1, // 🔥 Hindari cache lama
  },
});

export default nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   typescript: {
//     // !! WARN !!
//     // Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     // !! WARN !!
//     ignoreBuildErrors: false,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "2pwk5zmnkgubtogq.public.blob.vercel-storage.com",
//       },
//     ],
//   },
// }

// export default nextConfig

// import withPWA from 'next-pwa';

// const isProduction = process.env.NODE_ENV === 'production';

// const nextConfig = {
//   reactStrictMode: true,
//   typescript: {
//     ignoreBuildErrors: false,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "2pwk5zmnkgubtogq.public.blob.vercel-storage.com",
//       },
//     ],
//   },
//   pwa: {
//     dest: 'public',
//     disable: !isProduction,
//     exclude: ['sw.js'],
//     register: true,
//     skipWaiting: true,
//   },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Ensure the PWA plugin is only applied on the client side
//       config.plugins.push(
//         withPWA({
//           dest: 'public',
//           disable: !isProduction,
//           exclude: ['sw.js'],
//           register: true,
//           skipWaiting: true,
//         })
//       );
//     }
//     return config;
//   },
// };

// export default withPWA(nextConfig);
