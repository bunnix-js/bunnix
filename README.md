# Swiftx

[![Swiftx logo](images/swiftx-transparent-regular.png)](https://morissonmaciel.github.io/swiftx/)

[![Tests](https://github.com/morissonmaciel/swiftx/actions/workflows/main.yml/badge.svg)](https://github.com/morissonmaciel/swiftx/actions/workflows/main.yml)
![Node.js](https://img.shields.io/badge/node-18.x%20%7C%2020.x-339933)

[Read the full documentation](https://morissonmaciel.github.io/swiftx/)

Swiftx is an ultra-lightweight, functional-first UI framework with a minimal router. It favors explicit, "no magic" APIs, reactive state, and a tiny footprint.

## Why Swiftx

- **Functional elements**: build UI with plain functions or a Proxy-based tag DSL.
- **Reactive state**: `useState` atoms update the DOM with minimal overhead.
- **Immediate effects**: `useEffect` runs immediately for predictable setup.
- **Super lightweight**: core stays under ~2KB gzipped.
- **No dependencies**: vanilla JS, small bundle size.
- **Router included**: opt-in, scoped navigation with route groups and policies.

## Install

```bash
npm install swiftx
```

## Quick Start

```js
import Swiftx, { BrowserRouter } from 'swiftx';
import { RouterRoot, RouteGroup, Route, Link } from 'swiftx/router';

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

Swiftx.render(
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
import Swiftx from 'swiftx';
const { div, h1, p, button } = Swiftx;

const View = () => (
    div({ class: 'panel' }, [
        h1('Hello Swiftx'),
        p('A tiny functional-first UI framework.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

### State and Effects

```js
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

### Keyed List Updates

```js
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

### Conditional Rendering

```js
import Swiftx, { Show } from 'swiftx';
const isVisible = Swiftx.useState(false);

const Panel = () => (
    Swiftx('div', [
        Show(isVisible, () => Swiftx('p', 'Now you see me')),
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## Router Overview

Swiftx Router is scoped and context-aware. You define routes with groups and policies and receive a `navigation` object in matched components or layouts.

```js
import Swiftx from 'swiftx';
import { RouterRoot, RouteGroup, Route, Link } from 'swiftx/router';

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

- `Swiftx(tag, props, children)` or `Swiftx.[tag](props, children)`
- `Swiftx.useState(initial)`, `Swiftx.useEffect(cb, deps)`, `Swiftx.useRef()`
- `Swiftx.whenReady(cb)`, `Swiftx.render(vdom, container)`
- `Show(state, content)`, `Swiftx.ForEach(state, key, render)`
- Router: `BrowserRouter`, `RouterRoot`, `RouteGroup`, `RoutePolicy`, `Route`, `Link`

## Docs

- Published documentation: https://morissonmaciel.github.io/swiftx/
- Core framework: `src/swiftx/README.md`
- Router: `src/swiftx-router/README.md`

## License

ISC
