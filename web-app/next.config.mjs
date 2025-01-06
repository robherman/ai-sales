/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "app.localhost:3000"],
    },
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "domain.s3.amazonaws.com" },
      { hostname: "avatar.vercel.sh" },
    ],
  },
};

export default nextConfig;
