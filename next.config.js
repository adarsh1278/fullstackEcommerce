/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["th.bing.com","example.com"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;
  
  