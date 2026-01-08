---
layout: default
title: Rendering
---

# Rendering

Use `Swiftx.render` to mount your root component or VDOM into a container element.

## Render a Component

```javascript
import Swiftx from 'swiftx';
import App from './App.js';

Swiftx.render(
    App,
    document.getElementById('root')
);
```

## Render VDOM Directly

```javascript
import Swiftx from 'swiftx';

const view = Swiftx('h1', 'Hello');

Swiftx.render(
    view,
    document.getElementById('root')
);
```
