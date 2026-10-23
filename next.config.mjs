/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Дає доступ до Cloudflare-біндингів (rate limiter тощо) під час `next dev`.
if (process.argv.includes("dev")) {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}
