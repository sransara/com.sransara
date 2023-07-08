module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 100,
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss')
  ],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' }
    }
  ]
};
