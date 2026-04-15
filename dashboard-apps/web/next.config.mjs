/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow Next.js/Turbopack to trace files from the shared package
    // that lives outside the web/ project root (via node_modules symlink).
    outputFileTracingRoot: '/Users/aravindsekar/Desktop/Development/dashboard-apps',
};

export default nextConfig;
