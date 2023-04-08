/**
 * @type {import('postcss').PluginCreator}
 */
const path = require('path');
const glob = require('glob');

const { sortFiles } = require('./utils');

module.exports = (opts = {}) => {
  const options = Object.assign({
    fontsDir: './fonts/',
    fontPath: '/fonts/',
    local: true,
    swap: true
  }, opts);

  const fontWeightMap = {
    Thin: '100',
    ExtraLight: '200',
    Light: '300',
    Regular: '400',
    Medium: '500',
    SemiBold: '600',
    Bold: '700',
    ExtraBold: '800',
    Black: '900'
  };

  return {
    postcssPlugin: 'postcss-fontify',

    Root (root, postcss) {
        const fontsDir = options.fontsDir;

        const fontFiles = glob.sync(`${fontsDir}/**/*.{woff2,woff,ttf,otf}`);
        if (fontFiles.length === 0) {
          root.warn(postcss.result, `[WARNING] No font files found in directory: ${fontsDir}`);
        }

        const fontFamilies = new Map();

        fontFiles.forEach(file => {
          const extension = path.extname(file);
          const fileName = path.basename(file, extension);
          const relativePath = path.relative(fontsDir, file);
          const srcPath = path.join(options.fontPath, relativePath);

          let [font, style] = fileName.split('-');
          const fontFamily = font.replace(/([a-z])([A-Z])/g, '$1 $2');
          let fontWeight = '400';
          let fontStyle = 'normal';
          let srcFormat = extension;

          if (style && style.includes('Italic')) {
            fontStyle = 'italic';
            style = style.replace('Italic', '');
          }

          if (style && style.includes('Var')) {
            const [start = Number.NaN, end = Number.NaN] = style.split('Var')[1].split('_').map(x => x === '' ? Number.NaN : Number(x));

            if (!Object.is(start, Number.NaN) && !Object.is(end, Number.NaN)) {
              fontWeight = `${start} ${end}`;
            }

            if (!Object.is(start, Number.NaN) && Object.is(end, Number.NaN)) {
              fontWeight = `${start}`;
            }

            srcFormat = 'woff2-variations';
          }

          if (style && fontWeightMap[style]) {
            fontWeight = fontWeightMap[style];
          }

          if (!fontFamilies.has(fileName)) {
            fontFamilies.set(fileName, {
              fontFamily,
              fontSrc: [{ srcFormat, srcPath }],
              fontWeight,
              fontStyle
            });
          } else {
            const font = fontFamilies.get(fileName);

            if (!font.fontSrc.some(obj => obj.srcFormat === srcFormat)) {
              font.fontSrc.push({ srcFormat, srcPath });
            }
            fontFamilies.set(fileName, font);
          }
        });

        fontFamilies.forEach((fontFace) => {
          let fontSrc = fontFace.fontSrc.sort(sortFiles).map((src) => `url("${src.srcPath}") format("${src.srcFormat.slice(1)}")`).join(', ').toString();

          if (options.local) {
            fontSrc = `local("${fontFace.fontFamily}"), ${fontSrc}`;
          }

          const nodes = [
            postcss.decl({
              prop: 'font-family',
              value: `"${fontFace.fontFamily}"`
            }),
            postcss.decl({
              prop: 'src',
              value: fontSrc
            }),
            postcss.decl({
              prop: 'font-weight',
              value: fontFace.fontWeight
            }),
            postcss.decl({
              prop: 'font-style',
              value: fontFace.fontStyle
            })
          ];

          if (options.swap) {
            nodes.push(
              postcss.decl({
                prop: 'font-display',
                value: 'swap',
              })
            );
          }

          const fontFaceDeclarations = postcss.root({ nodes });

          root.prepend(
            postcss.atRule({
              name: 'font-face',
              params: '',
              nodes: fontFaceDeclarations.nodes
            })
          );
        });

    }
  };
};

module.exports.postcss = true;
