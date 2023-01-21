const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, 'public/index.html'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [require('../../tailwind.base.config.js')],
};
