const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('Create default output from files in font folder', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: local("Prague Special"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff2");
    font-weight: 200;
    font-style: italic;
    font-display: swap
}
@font-face {
    font-family: "Prague";
    src: local("Prague"), url("/fonts/Prague-Black.woff") format("woff"), url("/fonts/Prague-Black.woff") format("woff2");
    font-weight: 900;
    font-style: normal;
    font-display: swap
}`
  await run('', output, { })
})

it('Create output from files in font folder without swap option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: local("Prague Special"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff2");
    font-weight: 200;
    font-style: italic
}
@font-face {
    font-family: "Prague";
    src: local("Prague"), url("/fonts/Prague-Black.woff") format("woff"), url("/fonts/Prague-Black.woff") format("woff2");
    font-weight: 900;
    font-style: normal
}`
  await run('', output, { swap: false })
})

it('Create output from files in font folder without swap and local option', async () => {
  const output = `@font-face {
    font-family: "Prague Special";
    src: url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("ttf"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff"), url("/fonts/PragueSpecial-ExtraLightItalic.ttf") format("woff2");
    font-weight: 200;
    font-style: italic
}
@font-face {
    font-family: "Prague";
    src: url("/fonts/Prague-Black.woff") format("woff"), url("/fonts/Prague-Black.woff") format("woff2");
    font-weight: 900;
    font-style: normal
}`
  await run('', output, { swap: false, local: false })
})

it('The console should display a warning message when no font files are found in the given directory', async () => {
  const result = await postcss([plugin({ fontsDir: './fonts/empty/' })]).process('', { from: undefined })
  expect(result.warnings()).toHaveLength(1)
})
