---
layout: default
title: Refs
---

# Refs

`useRef` returns a stable `{ current }` object for DOM access and imperative APIs.

```javascript
import Swiftx from 'swiftx';

const inputRef = Swiftx.useRef();

const FocusView = () => (
    Swiftx('div', [
        Swiftx('input', { ref: inputRef, type: 'text' }),
        Swiftx('button', { click: () => inputRef.current.focus() }, 'Focus Input')
    ])
);
```
