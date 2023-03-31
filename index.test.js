const postcss = require('postcss');
const { sortFiles } = require('./utils');
const plugin = require('./');


async function run (input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

test('sortFiles sorts files by extension alphabetically', () => {
  const files = [
    {name: 'file3', ext: 'c'},
    {name: 'file1', ext: 'a'},
    {name: 'file4', ext: 'd'},
    {name: 'file5', ext: 'd'},
    {name: 'file2', ext: 'b'},
  ];
  const expectedOrder = [
    {name: 'file1', ext: 'a'},
    {name: 'file2', ext: 'b'},
    {name: 'file3', ext: 'c'},
    {name: 'file4', ext: 'd'},
    {name: 'file5', ext: 'd'},
  ];
  const sortedFiles = files.sort(sortFiles);
  expect(sortedFiles).toEqual(expectedOrder);
});

it('The console should display a warning message when no font files are found in the given directory', async () => {
  const result = await postcss([plugin({ fontsDir: './fonts/empty/' })]).process('', { from: undefined });
  expect(result.warnings()).toHaveLength(1);
});

it('Create default output from files in font folder', async () => {
  const output = `@font-face {
    font-family: "Prague";
    src: local("Prague"), url("/fonts/Prague-Black.woff") format("woff"), url("/fonts/Prague-Black.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
    font-display: swap
}`;
  await run('', output, { fontsDir: './fonts/Prague/' });
});

it('Create output from files in font folder without swap option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: local("Prague Special"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf"), url("/fonts/PragueSpecial-ExtraLightItalic.woff") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.woff2") format("woff2");
    font-weight: 200;
    font-style: italic
}`;
  await run('', output, { fontsDir: './fonts/PragueSpecial/', swap: false });
});

it('Create output from files in font folder without swap and local option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf"), url("/fonts/PragueSpecial-ExtraLightItalic.woff") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.woff2") format("woff2");
    font-weight: 200;
    font-style: italic
}`;
  await run('', output, { fontsDir: './fonts/PragueSpecial/', swap: false, local: false });
});
