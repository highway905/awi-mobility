/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
      HOST_API_KEY: process.env.HOST_API_KEY ,
      HOST_API_FE: process.env.HOST_API_FE ,
      ENCRYPT_PUBLIC_KEY: process.env.ENCRYPT_PUBLIC_KEY
  },
  // Add webpack optimization for chunk loading
  webpack: (config, { isServer }) => {
    // Only run on client-side
    if (!isServer) {
      // Optimize chunk size
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for third-party modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk for code shared between pages
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;