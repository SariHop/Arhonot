/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   // "res.cloudinary.com",
    //   "img.icons8.com",
    //   "example.com",
    //   "hahacanvas.co.il",
    //   "www.photo-art.co.il",
    //   "encrypted-tbn0.gstatic.com",
    //   "localhost",
    //   "media.geeksforgeeks.org",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "hahacanvas.co.il",
      },
      {
        protocol: "https",
        hostname: "www.photo-art.co.il",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org",
      },
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
};
export default nextConfig;
