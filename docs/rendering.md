---
layout: default
title: Rendering
---

# Rendering

Use `Bunnix.render` to mount your root component or VDOM into a container element.

## Render a Component

```javascript
import Bunnix from '@bunnix/core';
import App from './App.js';

Bunnix.render(
    App,
    document.getElementById('root')
);
```

## Render VDOM Directly

```javascript
import Bunnix from '@bunnix/core';

const view = Bunnix('h1', 'Hello');

Bunnix.render(
    view,
    document.getElementById('root')
);
```

## Low-level: toDOM

`Bunnix.toDOM(vdom)` converts VDOM into a DOM node without diffing. This is intended for advanced integrations, not typical app rendering.

```javascript
import Bunnix from '@bunnix/core';

const node = Bunnix.toDOM(Bunnix('div', 'Hello'));
document.body.appendChild(node);
```

```javascript
import Bunnix, { toDOM } from '@bunnix/core';

const node = toDOM(Bunnix('div', 'Hello'));
document.body.appendChild(node);
```
