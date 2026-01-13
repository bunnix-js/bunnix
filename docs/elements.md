---
layout: default
title: Elements
---

# Elements

Bunnix builds UI as VDOM using a tiny factory plus a tag DSL.

## Tag DSL

```javascript
import Bunnix from '@bunnix/core';
const { div, h1, p, button } = Bunnix;

const Card = () => (
    div({ class: 'card' }, [
        h1('Bunnix'),
        p('Functional-first UI.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

## Factory Form

```javascript
import Bunnix from '@bunnix/core';

const Card = () => (
    Bunnix('div', { class: 'card' }, [
        Bunnix('h1', 'Bunnix'),
        Bunnix('p', 'Functional-first UI.'),
        Bunnix('button', { click: () => alert('Clicked!') }, 'Click')
    ])
);
```

## Props and Events

Pass props as an object. Event handlers use lower-case event names like `click`.

```javascript
const Button = () => (
    Bunnix('button', { class: 'primary', click: () => alert('Saved') }, 'Save')
);
```

## Reactive Props

You can pass a state atom directly as a prop value. Bunnix will update the DOM property/attribute when the state changes.

```javascript
import Bunnix from '@bunnix/core';

const name = Bunnix.useState('');
const isDisabled = name.map((value) => !value);

const Form = () => (
    Bunnix('form', [
        Bunnix('input', {
            type: 'text',
            value: name,
            change: (event) => name.set(event.target.value)
        }),
        Bunnix('button', { type: 'submit', disabled: isDisabled }, 'Save')
    ])
);
```

## Children

Children can be strings, VDOM nodes, arrays, or nested component results.

```javascript
const List = () => (
    Bunnix('ul', [
        Bunnix('li', 'One'),
        Bunnix('li', 'Two')
    ])
);
```
