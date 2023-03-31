/**
 * @type {import('postcss').PluginCreator}
 */
const path = require('path');
const glob = require('glob');

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
    postcssPlugin: 'postcss-font-face-generator',

    Root (root, postcss) {
        const fontsDir = options.fontsDir;

        const fontFiles = glob.sync(`${fontsDir}/**/*.{woff2,woff,ttf,otf}`);
        if (fontFiles.length === 0) {
          root.warn(postcss.result, `[WARNING] No font files found in directory: ${fontsDir}`);
        }

        const fontFamilies = new Map();

        fontFiles.forEach((file) => {
          const ext = path.extname(file);
          const fontName = path.basename(file, ext);
          const relativePath = path.relative(fontsDir, file);
          const fontFilePath = path.join(options.fontPath, relativePath);

          let fontWeight = '400';
          let fontStyle = 'normal';
          let fontFamily = fontName;

          if (fontName.includes('-')) {
            const parts = fontName.split('-');
            fontFamily = parts[0];

            if (parts[1].includes('Italic')) {
              fontStyle = 'italic';
              fontWeight = parts[1].replace('Italic', '');
            } else {
              fontWeight = parts[1];
            }

            fontWeightMap[fontWeight] ? fontWeight = fontWeightMap[fontWeight] : fontWeight;
          }

          fontFamily = fontFamily.replace(/([a-z])([A-Z])/g, '$1 $2');

          if (!fontFamilies.has(fontName)) {
            fontFamilies.set(fontName, {
              fontFamily,
              ext: [ext],
              fontFilePath,
              fontWeight,
              fontStyle
            });
          } else {
            const font = fontFamilies.get(fontName);

            if (!font.ext.includes(ext)) {
              font.ext.push(ext);
            }
            fontFamilies.set(fontName, font);
          }
        });

        fontFamilies.forEach((fontFace) => {
          let fontSrc = fontFace.ext.map((extension) => `url("${fontFace.fontFilePath}") format("${extension.slice(1)}")`).join(', ').toString();

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
