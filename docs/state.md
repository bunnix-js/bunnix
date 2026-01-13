---
layout: default
title: State
---

# State

`useState` returns a reactive state atom. The atom exposes `get`, `set`, `subscribe`, and `map`.

## Basic State

```javascript
import Bunnix from '@bunnix/core';

const count = Bunnix.useState(0);

const Counter = () => (
    Bunnix('div', [
        Bunnix('p', ['Count: ', count]),
        Bunnix('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);
```

## Derived State with map

```javascript
const count = Bunnix.useState(2);
const doubled = count.map((value) => value * 2);

const View = () => (
    Bunnix('p', ['Double: ', doubled])
);
```

## Subscriptions

Use `subscribe` for side effects or interop when you need to observe changes.

```javascript
const count = Bunnix.useState(0);

const unsubscribe = count.subscribe((value) => {
    console.log('Count changed:', value);
});

// Later, call unsubscribe() to stop listening.
```

## Computed State (Compute / useMemo)

Use `Bunnix.Compute` (or `useMemo`) to derive a read-only state atom from one or more states.

```javascript
const first = Bunnix.useState('Ada');
const last = Bunnix.useState('Lovelace');

const fullName = Bunnix.Compute([first, last], (a, b) => `${a} ${b}`);
// or: const fullName = Bunnix.useMemo([first, last], (a, b) => `${a} ${b}`);

const View = () => (
    Bunnix('p', ['Name: ', fullName])
);
```

## Reactive Props

You can pass state atoms directly to element props to keep the DOM in sync.

```javascript
const name = Bunnix.useState('');
const disabled = name.map((value) => !value);

const Form = () => (
    Bunnix('form', [
        Bunnix('input', {
            type: 'text',
            value: name,
            change: (event) => name.set(event.target.value)
        }),
        Bunnix('button', { disabled }, 'Save')
    ])
);
```
