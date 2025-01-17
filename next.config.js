// const withContentlayer = require("next-contentlayer").withContentlayer;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nextui-org/react", "@nextui-org/theme"],
  swcMinify: true,
  // reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  // redirects: require("./next-redirect.js"),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: process.env.IS_VERCEL_ENV === "true",
    ignoreBuildErrors: true,
  },
  images: {
    // domains: [   // when use NextImage to serve images from other source, configure this
    //   "opencollective-production.s3.us-west-1.amazonaws.com",
    //   "avatars.githubusercontent.com",
    //   "logo.clearbit.com",
    //   "i.pravatar.cc",
    //   "nextui.org",
    // ],
  },
  serverComponentsExternalPackages: [
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
  ],
};

// module.exports = withContentlayer(nextConfig);
