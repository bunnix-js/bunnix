---
layout: default
title: Getting Started
---

# Getting Started

Bunnix is a functional-first UI framework. This guide gets you from install to a working view and points to deeper concepts.

## Install

```bash
npm install @bunnix/core
```

## First Render

```javascript
import Bunnix from '@bunnix/core';

const App = () => Bunnix('h1', 'Hello Bunnix');

Bunnix.render(
    App,
    document.getElementById('root')
);
```

## Elements (Tag DSL)

```javascript
import Bunnix from '@bunnix/core';
const { div, h1, p, button } = Bunnix;

const App = () => (
    div({ class: 'panel' }, [
        h1('Welcome'),
        p('Bunnix uses functions for UI.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

If you prefer JSX, configure your tooling to compile JSX to `Bunnix(...)` calls. See the [JSX guide](./jsx.md).

## State and Effects

```javascript
import Bunnix from '@bunnix/core';

const count = Bunnix.useState(0);

const Counter = () => (
    Bunnix('div', [
        Bunnix('p', ['Count: ', count]),
        Bunnix('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);

Bunnix.useEffect(() => {
    console.log('Effect runs immediately on call');
}, []);
```

## Conditional Rendering

```javascript
import Bunnix, { Show } from '@bunnix/core';
const isVisible = Bunnix.useState(false);

const Panel = () => (
    Bunnix('div', [
        Show(isVisible, () => Bunnix('p', 'Now you see me')),
        Bunnix('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## Keyed Lists

```javascript
import Bunnix from '@bunnix/core';

const expenses = Bunnix.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const ExpenseList = () => (
    Bunnix('ul', [
        Bunnix.ForEach(expenses, 'id', (item) =>
            Bunnix('li', item.label)
        )
    ])
);
```

## Next Steps

- Read the [Core Overview](./core.md) to understand the Bunnix mental model.
- Use [Examples](./examples.md) to see full, reactive apps.
