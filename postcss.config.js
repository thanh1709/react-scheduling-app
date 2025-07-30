module.exports = {
  plugins: [
    require('postcss-import'),  // bắt buộc nếu dùng @import trong CSS
    require('tailwindcss'),     // tailwind v3, KHÔNG dùng @tailwindcss/postcss
    require('autoprefixer'),
  ],
};
