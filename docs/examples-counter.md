---
layout: default
title: Example - Counter
---

# Example - Counter

This example shows reactive state, derived state, and an immediate effect.

```javascript
import Swiftx from 'swiftx';

const count = Swiftx.useState(0);
const doubled = count.map((value) => value * 2);

const Counter = () => (
    Swiftx('div', { class: 'counter' }, [
        Swiftx('h1', 'Counter'),
        Swiftx('p', ['Count: ', count]),
        Swiftx('p', ['Doubled: ', doubled]),
        Swiftx('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);

Swiftx.useEffect(() => {
    console.log('Counter mounted');
}, []);

Swiftx.render(
    Counter,
    document.getElementById('root')
);

Swiftx.whenReady(() => {
    console.log('DOM ready after render');
});
```
