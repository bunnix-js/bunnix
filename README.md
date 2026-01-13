# Bunnix

[![Bunnix logo](images/bunnix-transparent-regular.png)](https://bunnix-js.github.io/bunnix/)

[![Tests](https://github.com/bunnix-js/bunnix/actions/workflows/main.yml/badge.svg)](https://github.com/bunnix-js/bunnix/actions/workflows/main.yml)
![Node.js](https://img.shields.io/badge/node-18.x%20%7C%2020.x-339933)

[Read the full documentation](https://bunnix-js.github.io/bunnix/)

Bunnix is an ultra-lightweight, functional-first UI framework with a minimal router. It favors explicit, "no magic" APIs, reactive state, and a tiny footprint.

## Why Bunnix

- **Functional elements**: build UI with plain functions or a Proxy-based tag DSL.
- **Reactive state**: `useState` atoms update the DOM with minimal overhead.
- **Immediate effects**: `useEffect` runs immediately for predictable setup.
- **Super lightweight**: core stays under ~2KB gzipped.
- **No dependencies**: vanilla JS, small bundle size.
- **Router included**: opt-in, scoped navigation with route groups and policies.

## Install

```bash
npm install @bunnix/core
```

## Quick Start

```js
import Bunnix, { BrowserRouter } from '@bunnix/core';
import { RouterRoot, RouteGroup, Route, Link } from '@bunnix/core/router';

const Home = () => (
    <div>
        <h1>Home</h1>
        <Link to="/about">About</Link>
    </div>
);

const About = () => <div>About</div>;

const App = () => (
    <RouterRoot>
        <RouteGroup root>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
        </RouteGroup>
        <Route notFound component={() => <div>Not found</div>} />
    </RouterRoot>
);

Bunnix.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
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

## Router Overview

Bunnix Router is scoped and context-aware. You define routes with groups and policies and receive a `navigation` object in matched components or layouts.

```js
import Bunnix from '@bunnix/core';
import { RouterRoot, RouteGroup, Route, Link } from '@bunnix/core/router';

const App = () => (
    <RouterRoot>
        <RouteGroup root layout={AppLayout}>
            <Route path="/" component={Home} />
            <Route path="/user/:id" component={UserProfile} />
        </RouteGroup>
        <Route notFound component={NotFound} />
    </RouterRoot>
);
```

## API Highlights

- `Bunnix(tag, props, children)` or `Bunnix.[tag](props, children)`
- `Bunnix.useState(initial)`, `Bunnix.useEffect(cb, deps)`, `Bunnix.useRef()`
- `Bunnix.whenReady(cb)`, `Bunnix.render(vdom, container)`
- `Show(state, content)`, `Bunnix.ForEach(state, key, render)`
- Router: `BrowserRouter`, `RouterRoot`, `RouteGroup`, `RoutePolicy`, `Route`, `Link`

## Docs

- Published documentation: https://bunnix-js.github.io/bunnix/
- Core framework: `src/bunnix/README.md`
- Router: `src/bunnix-router/README.md`

## License

ISC
