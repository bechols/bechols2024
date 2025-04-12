import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_COMMIT_SHA: commitHash,
  },
  images: {
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
  },
};

export default nextConfig;