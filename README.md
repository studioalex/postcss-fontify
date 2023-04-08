# PostCSS Fontify [![npm version](https://badge.fury.io/js/postcss-fontify.svg)](https://badge.fury.io/js/postcss-fontify)

[PostCSS](https://github.com/postcss/postcss) plugin for generating font-face declarations from font files in a directory.

## Usage

Only font files with extensions `woff2`, `woff`, `ttf`, and `otf` will be recognized and used by the plugin. Any other files with different extensions in the same directory will not be considered. Additionally, the files in the directory must be named in accordance with a specific convention.

### Filename convention

The filename should have two parts. The first part should consist of the font name or font names written without any spaces and with the first letter of each word capitalized. The second part should be separated by a hyphen sign (-) and should contain the font weight and font style. The font style should only be included when the font is italic. The font weight can be one of the following: `Thin`, `ExtraLight`, `Light`, `Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold` and `Black`. The two parts should be separated again by a capital letter. For example: `PragueSpecial-SemiBoldItalic.woff2.`

### Variable fonts

Fontify supports Variable Fonts, a new font technology that enables designers and developers to create a single font file with multiple variations of the font, including different weights, styles, and other properties. This technology allows for a more efficient and flexible way of delivering fonts to websites and other digital applications, reducing the file size and allowing for a more customized user experience.

The Variable Fonts page on the Adobe Type team's official website provides a more detailed explanation and examples: [https://typekit.com/variablefonts](https://typekit.com/variablefonts).

To correctly define the @font-face, Variable Fonts are only supported in the `woff2` format and require additional information about the `font-weight` range, which is expressed as number values. The name convention for Variable Fonts requires the keyword 'Var' followed by the font-weight start and end value, separated by an underscore.

If you need to determine which weights your Variable Fonts support or convert Variable font `ttf` to `woff2`, here are some helpful links:

- [Axis Praxis](https://www.axis-praxis.org/) A website for playing with OpenType Variable Fonts
- [Wakamai Fondue](https://wakamaifondue.com/) A tool for revealing all font information
- [V-Fonts](https://v-fonts.com/) A simple resource for finding and trying variable fonts
- [Every Things Fonts](https://everythingfonts.com/ttf-to-woff2)A font converter and compression tool
- [Woff2 Converter](https://github.com/google/woff2) A command line font compression tool from Google

## Input

From the font files in the specified folder:

```sh
`PragueSpecial-SemiBoldItalic.woff2.`
├── public
│   ├── fonts
│   │   ├── PragueSpecial-SemiBoldItalic.woff2
│   │   ├── PragueSpecial-SemiBoldItalic.woff
│   │   ├── PragueSpecial-SemiBoldItalic.ttf
│   │   ├── PragueSpecial-SemiBold.woff2
│   │   ├── PragueSpecial-SemiBold.woff
│   │   ├── PragueVariable-Var100_900.woff2
```

## Output

The following `@font-face` declaration is created:

```css
@font-face {
  family-name: "Prague Special";
  src: local("Prague Special"),
       url("/fonts/PragueSpecial-SemiBoldItalic.woff2") format("woff2"),
       url("/fonts/PragueSpecial-SemiBoldItalic.woff") format("woff"),
       url("/fonts/PragueSpecial-SemiBoldItalic.ttf") format("ttf");
  font-style: italic;
  font-weight: 600;
  font-display: swap;
}

@font-face {
  family-name: "Prague Special";
  src: local("Prague Special"),
       url("/fonts/PragueSpecial-SemiBold.woff2") format("woff2"),
       url("/fonts/PragueSpecial-SemiBold.woff") format("woff");
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}

@font-face {
  family-name: "Prague Variable";
  src: local("Prague Variable"),
       url("/fonts/PragueVariable-SemiBold.woff2") format("woff2-variations");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}
```

The font folder can contain multiple font files with the same name and different formats. They will be all used in the `src` property.

## Install

**Step 1:** Install `postcss-fontify` plugin:

```sh
npm install --save-dev postcss postcss-fontify
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

**Step 3:** Add the plugin to plugin list:

```diff
module.exports = {
  plugins: [
+   require('postcss-font-face-generator')({
+     fontsDir: './public/fonts/',
+     fontPath: '/fonts/'
+   }),
    require('autoprefixer')
  ]
}
```

## Options

- `fontsDir`: The path to the directory containing the font files. Defaults to `'./fonts/'`.
- `fontPath`: The path for the `@font-face`.`url` declaration. Defaults to `'/fonts/'`.
- `local`: A boolean value indicating if a local font reference should be used. Defaults to `true`.
- `swap`: A boolean value indicating if the `font-display` property should be set to `'swap'`. Defaults to `true`.

[official docs]: https://github.com/postcss/postcss#usage
