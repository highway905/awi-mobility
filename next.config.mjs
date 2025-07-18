/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    HOST_API_KEY: process.env.HOST_API_KEY || "http://api-qa-gateway-service:7000/",
    HOST_API_FE: process.env.HOST_API_FE || "http://h905awi-qa-mobility-service:3000/",
    ENCRYPT_PUBLIC_KEY: process.env.ENCRYPT_PUBLIC_KEY || "-----BEGIN PUBLIC KEY-----\\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKNOjgcbVefxYyNP05VE74Azxt\\nywzM6qsQuAQc/Y75MUm4q03tO6BCwAH+dSJXkxloA9yol0ve44i9bVRu45uyRlTX\\ny9AenA6Vg54ECZ6s/as6wbqvTICTBAk3dUU3bOG3lGRkJYzbsyyWjTl7AiSI3Z4B\\nqyimdBzSBkVqLTCa2QIDAQAB\\n-----END PUBLIC KEY-----"
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
