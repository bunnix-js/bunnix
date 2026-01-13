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
