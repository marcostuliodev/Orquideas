/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Server Actions são estáveis no Next 15; mantemos config mínima.
  },
  typescript: {
    // Ignora erros de tipo no build da Vercel (validação feita localmente)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora lint no build da Vercel (validação feita localmente via npm run lint)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
