import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    defaultLocale: "uk",
    locales: ["uk", "en"],
    localeDetection: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
