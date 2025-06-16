import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'abcsport.com.vn',
      'www.recipetineats.com',
      'statics.vincom.com.vn',
      'www.huongnghiepaau.com',
      'cdn.tgdd.vn',
      'giavichinsu.com',
      'upload.wikimedia.org',
      'i-giadinh.vnecdn.net',
      'heyyofoods.com',
      'file.hstatic.net',
      'drinkocany.com',
      'cdn.eva.vn',
      'drinkocany.com',
      'www.gopalnamkeen.com',
      'example.com',
      'localhost',
      'daotaobeptruong.vn',
      'afamilycdn.com',
      'suckhoedoisong.qltns.mediacdn.vn',
      'static.vinwonders.com',
      'encrypted-tbn0.gstatic.com',
      'toquoc.mediacdn.vn',
      'media.istockphoto.com',
      'statics.vinpearl.com',
      'img.tripi.vn',
      'tranglinh-foods.com',
    ], // <-- thêm domain ở đây
  },
  remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/Uploads/**",
      },
      {
        protocol: "https",
        hostname: "drinkocany.com", // Cho category.img
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.gopalnamkeen.com", // Cho banner
        pathname: "/storage/product_gallary_images/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**", // Hoặc cụ thể hơn nếu biết đường dẫn, ví dụ: "/images/**"
      },
    ],
};

export default nextConfig;