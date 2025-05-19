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
    ], // <-- thêm domain ở đây
  },
};

export default nextConfig;
