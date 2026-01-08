---
layout: default
title: Getting Started
---

# Getting Started

Swiftx is a functional-first UI framework with an opt-in router. This guide gets you from install to a working view and points to deeper concepts.

## Install

```bash
npm install swiftx
```

## First Render

```javascript
import Swiftx from 'swiftx';

const App = () => Swiftx('h1', 'Hello Swiftx');

Swiftx.render(
    App,
    document.getElementById('root')
);
```

## Elements (Tag DSL)

```javascript
import Swiftx from 'swiftx';
const { div, h1, p, button } = Swiftx;

const App = () => (
    div({ class: 'panel' }, [
        h1('Welcome'),
        p('Swiftx uses functions for UI.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

If you prefer JSX, configure your tooling to compile JSX to `Swiftx(...)` calls. See the [JSX guide](./jsx.md).

## State and Effects

```javascript
import Swiftx from 'swiftx';

const count = Swiftx.useState(0);

const Counter = () => (
    Swiftx('div', [
        Swiftx('p', ['Count: ', count]),
        Swiftx('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);

Swiftx.useEffect(() => {
    console.log('Effect runs immediately on call');
}, []);
```

## Conditional Rendering

```javascript
import Swiftx, { Show } from 'swiftx';
const isVisible = Swiftx.useState(false);

const Panel = () => (
    Swiftx('div', [
        Show(isVisible, () => Swiftx('p', 'Now you see me')),
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## Keyed Lists

```javascript
import Swiftx from 'swiftx';

const expenses = Swiftx.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const ExpenseList = () => (
    Swiftx('ul', [
        Swiftx.ForEach(expenses, 'id', (item) =>
            Swiftx('li', item.label)
        )
    ])
);
```

## Next Steps

- Read the [Core Overview](./core.md) to understand the Swiftx mental model.
- Use [Examples](./examples.md) to see full, reactive apps.
- If you need routing, start at the [Router Overview](./router.md).
