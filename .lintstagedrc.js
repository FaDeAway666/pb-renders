module.exports = {
  '*.md *.json src/**/*.{js,jsx,ts,tsx,css,less,md,json}': ['prettier --check --ignore-unknown --write'],
  '*.{css,less}': ['stylelint --allow-empty-input --fix'],
  '*.{js,jsx,ts,tsx}': ['eslint'],
  // FIXME: disabling type checking until we are ready
  // also this doesn't work with tsx
  /**
   *
   * @param {string} filenames
   * @returns {string}
   */
  // '*.{ts,tsx}': (filenames) =>
  //   ['tsc', '--skipLibCheck', '--noEmit', ...filenames].join(' '),
};
