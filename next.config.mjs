/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.goodreads.com",
      },
      {
        protocol: "https",
        hostname: "**.gr-assets.com",
      },
    ],
  },};

export default nextConfig;