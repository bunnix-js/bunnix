# Bunnix

[![Bunnix logo](images/bunnix-transparent-regular.png)](https://bunnix-js.github.io/bunnix/)

[![Tests](https://github.com/bunnix-js/bunnix/actions/workflows/main.yml/badge.svg)](https://github.com/bunnix-js/bunnix/actions/workflows/main.yml)
![Node.js](https://img.shields.io/badge/node-18.x%20%7C%2020.x-339933)

[Read the full documentation](https://bunnix-js.github.io/bunnix/)

Bunnix is an ultra-lightweight, functional-first UI framework. It favors explicit, "no magic" APIs, reactive state, and a tiny footprint.

## Why Bunnix

- **Functional elements**: build UI with plain functions or a Proxy-based tag DSL.
- **Reactive state**: `useState` atoms update the DOM with minimal overhead.
- **Immediate effects**: `useEffect` runs immediately for predictable setup.
- **Super lightweight**: core stays under ~2KB gzipped.
- **No dependencies**: vanilla JS, small bundle size.

## Install

```bash
npm install @bunnix/core
```

## Quick Start

```js
import Bunnix from '@bunnix/core';

const App = () => (
    Bunnix('div', [
        Bunnix('h1', 'Hello Bunnix'),
        Bunnix('p', 'A tiny functional-first UI framework.')
    ])
);

Bunnix.render(App(), document.getElementById('root'));
```

## Core Usage

### Elements
Use the tag DSL for concise markup, or the factory for explicit control.

```js
import Bunnix from '@bunnix/core';
const { div, h1, p, button } = Bunnix;

const View = () => (
    div({ class: 'panel' }, [
        h1('Hello Bunnix'),
        p('A tiny functional-first UI framework.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

### State and Effects

```js
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

### Keyed List Updates

```js
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

### Conditional Rendering

```js
import Bunnix, { Show } from '@bunnix/core';
const isVisible = Bunnix.useState(false);

const Panel = () => (
    Bunnix('div', [
        Show(isVisible, () => Bunnix('p', 'Now you see me')),
        Bunnix('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## API Highlights

- `Bunnix(tag, props, children)` or `Bunnix.[tag](props, children)`
- `Bunnix.useState(initial)`, `Bunnix.useEffect(cb, deps)`, `Bunnix.useRef()`
- `Bunnix.whenReady(cb)`, `Bunnix.render(vdom, container)`
- `Show(state, content)`, `Bunnix.ForEach(state, key, render)`

## Low-level APIs

`Bunnix.toDOM(vdom)` converts VDOM to a DOM node without diffing. It is a low-level utility intended for integrations (for example, routing).

```js
const node = Bunnix.toDOM(Bunnix('div', 'Hello'));
document.body.appendChild(node);
```

## Docs

- Published documentation: https://bunnix-js.github.io/bunnix/
- Core framework: `src/README.md`

## License


ISC
