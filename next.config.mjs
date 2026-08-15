/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Server Actions são estáveis no Next 15; mantemos config mínima.
  },
};

export default nextConfig;
