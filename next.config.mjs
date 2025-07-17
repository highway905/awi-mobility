/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    HOST_API_KEY: process.env.HOST_API_KEY || "http://localhost:7000/",
    HOST_API_FE: process.env.HOST_API_FE || "http://localhost:3000/",
    ENCRYPT_PUBLIC_KEY: process.env.ENCRYPT_PUBLIC_KEY || "-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzKNt9jK8YmZ8iU6eydM4\\nYzQn0SdlFkWnj2j0QKdEKrIYCJgIwOYXRsH3rvxYpKMgJ8wS4BaraAPDFNGVBQXM\\nPQXEGLWZVyqQTyhCrxn4AJe6XVV2is/QEKyIG7bMNA/CSCIRGVvkRd+n9MmTXEYV\\nTMGzIeQj7Jj8YR+kQOwM+GTxBFn/pLQPgLwPgHHNwNqZQCnzYUBGY8N2y5/BUPzI\\nTEHSz/bQcW0RRdvYHfJ+QJNM7QcTVdTgZt7ewR7J+UIE5XxJWQQ1XKNI/BmI2nVF\\n5wUEjgLrDQnCJQ+87V0YeKjRMbfwMiPP+1vQZ5KOtKz7bkYAZUVFmgKc9MZGIXXy\\nrwIDAQAB\\n-----END PUBLIC KEY-----"
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
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
