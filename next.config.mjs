/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "img.icons8.com",
      "example.com",
      "hahacanvas.co.il",
      "www.photo-art.co.il",
      "encrypted-tbn0.gstatic.com",
      "localhost",
      "media.geeksforgeeks.org",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
    ],
  },
};
export default nextConfig;
