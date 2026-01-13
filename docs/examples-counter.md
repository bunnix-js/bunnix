---
layout: default
title: Example - Counter
---

# Example - Counter

This example shows reactive state, derived state, and an immediate effect.

```javascript
import Bunnix from '@bunnix/core';

const count = Bunnix.useState(0);
const doubled = count.map((value) => value * 2);

const Counter = () => (
    Bunnix('div', { class: 'counter' }, [
        Bunnix('h1', 'Counter'),
        Bunnix('p', ['Count: ', count]),
        Bunnix('p', ['Doubled: ', doubled]),
        Bunnix('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);

Bunnix.useEffect(() => {
    console.log('Counter mounted');
}, []);

Bunnix.render(
    Counter,
    document.getElementById('root')
);

Bunnix.whenReady(() => {
    console.log('DOM ready after render');
});
```
