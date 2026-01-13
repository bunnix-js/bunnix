---
layout: default
title: Refs
---

# Refs

`useRef` returns a stable `{ current }` object for DOM access and imperative APIs.

```javascript
import Bunnix from '@bunnix/core';

const inputRef = Bunnix.useRef();

const FocusView = () => (
    Bunnix('div', [
        Bunnix('input', { ref: inputRef, type: 'text' }),
        Bunnix('button', { click: () => inputRef.current.focus() }, 'Focus Input')
    ])
);
```
