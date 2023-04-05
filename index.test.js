const postcss = require('postcss');
const { sortFiles } = require('./utils');
const plugin = require('./');


async function run (input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

describe('sortFiles', () => {
  it('should sort files based on weights', () => {
    const files = [
      { name: 'file1', ext: 'ttf' },
      { name: 'file2', ext: 'woff2' },
      { name: 'file3', ext: 'woff' },
      { name: 'file4', ext: 'otf' },
    ];

    const sortedFiles = files.sort(sortFiles);

    expect(sortedFiles).toEqual([
      { name: 'file2', ext: 'woff2' },
      { name: 'file3', ext: 'woff' },
      { name: 'file1', ext: 'ttf' },
      { name: 'file4', ext: 'otf' },
    ]);
  });

  it('should sort files with the same weight based on extension', () => {
    const files = [
      { name: 'file1', ext: 'woff' },
      { name: 'file2', ext: 'woff2' },
      { name: 'file3', ext: 'otf' },
      { name: 'file4', ext: 'ttf' },
      { name: 'file5', ext: 'woff2' },
      { name: 'file6', ext: 'ttf' },
      { name: 'file7', ext: 'woff' },
      { name: 'file8', ext: 'otf' },
    ];

    const sortedFiles = files.sort(sortFiles);

    expect(sortedFiles).toEqual([
      { name: 'file2', ext: 'woff2' },
      { name: 'file5', ext: 'woff2' },
      { name: 'file1', ext: 'woff' },
      { name: 'file7', ext: 'woff' },
      { name: 'file4', ext: 'ttf' },
      { name: 'file6', ext: 'ttf' },
      { name: 'file3', ext: 'otf' },
      { name: 'file8', ext: 'otf' },
    ]);
  });
});

describe('Generate font-face', () => {
it('The console should display a warning message when no font files are found in the given directory', async () => {
  const result = await postcss([plugin({ fontsDir: './fonts/empty/' })]).process('', { from: undefined });
  expect(result.warnings()).toHaveLength(1);
});

it('Create default output from files in font folder', async () => {
  const output = `@font-face {
    font-family: "Prague";
    src: local("Prague"), url("/fonts/Prague-Black.woff2") format("woff2"), url("/fonts/Prague-Black.woff") format("woff");
    font-weight: 900;
    font-style: normal;
    font-display: swap
}`;
  await run('', output, { fontsDir: './fonts/Prague/' });
});

it('Create output from files in font folder without swap option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: local("Prague Special"), url("/fonts/PragueSpecial-ExtraLightItalic.woff2") format("woff2"), url("/fonts/PragueSpecial-ExtraLightItalic.woff") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf");
    font-weight: 200;
    font-style: italic
}`;
  await run('', output, { fontsDir: './fonts/PragueSpecial/', swap: false });
});

it('Create output from files in font folder without swap and local option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: url("/fonts/PragueSpecial-ExtraLightItalic.woff2") format("woff2"), url("/fonts/PragueSpecial-ExtraLightItalic.woff") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf");
    font-weight: 200;
    font-style: italic
}`;
  await run('', output, { fontsDir: './fonts/PragueSpecial/', swap: false, local: false });
});
});
