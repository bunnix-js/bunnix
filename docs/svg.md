---
layout: default
title: SVG Components
---

# SVG Components

Bunnix can render inline SVGs as components when your build pipeline converts `.svg` files into Bunnix-compatible JSX.

## Why Inline SVG

Using an inline `<svg>` lets you style fills and strokes via CSS (e.g. `color: ...`), and keeps the icon crisp at any size.

## Webpack + SVGR Setup

This setup uses a custom SVGR template and runs `babel-loader` after SVGR so JSX compiles to `Bunnix(...)` instead of `React.createElement`.

Create a template file at `bunnix-svgr-template.js`:

```javascript
// bunnix-svgr-template.js
module.exports = (variables, { tpl }) => {
    const { componentName, jsx } = variables;
    return tpl`
        import Bunnix from '@bunnix/core';
        const ${componentName} = (props) => ${jsx};
        export default ${componentName};
    `;
};
```

```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-react', {
                                    runtime: 'classic',
                                    pragma: 'Bunnix',
                                    pragmaFrag: 'Bunnix.Fragment'
                                }]
                            ]
                        }
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            exportType: 'default',
                            babel: false,
                            template: require('./bunnix-svgr-template.js'),
                            svgo: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'convertColors',
                                        params: { currentColor: true }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
};
```

## Usage

```javascript
import Bunnix from '@bunnix/core';
import Logo from './logo.svg';

const App = () => (
    <div class="brand">
        <Logo class="icon" width="24" height="24" />
        <span>Bunnix</span>
    </div>
);
```

```css
.brand .icon {
    color: #ff3b30;
}
```

If your loader exports a named component instead of a default, the import must match the export. For example:

```javascript
import { ReactComponent as Logo } from './logo.svg';
```

## Notes

- Ensure your project JSX also compiles with `pragma: 'Bunnix'`.
- If you import SVGs as URLs, use `<img src={logoUrl} />`, but you cannot style internal paths.
