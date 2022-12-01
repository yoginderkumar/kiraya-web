const path = require('path');
module.exports = {
  plugins: [
    'postcss-preset-env',
    require('tailwindcss')({
      config: path.resolve(__dirname, 'tailwind.config.js'),
    }),
    require('autoprefixer')(),
  ],
};
