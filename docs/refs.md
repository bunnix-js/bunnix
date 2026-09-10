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

## Initial values and subscriptions

`useRef(initialValue)` accepts an initial value and defaults to `null`. The returned ref exposes `current`, `get()`, and `subscribe(callback)`. `Bunnix.Ref` is an alias with the same behavior.

```typescript
import { useRef } from '@bunnix/core';

const inputRef = useRef<HTMLInputElement>();
const unsubscribe = inputRef.subscribe((node) => node?.focus());
const node = inputRef.get(); // HTMLInputElement | null

unsubscribe();
```

The renderer updates the ref and notifies subscribers when it creates the DOM node, before that node is necessarily attached to its container. There is no public `set()` method. Assigning `current` manually does not notify subscribers or change the value returned by `get()`.
