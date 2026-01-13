---
layout: default
title: Directives
---

# Directives

Bunnix provides two rendering directives: `Show` and `ForEach`.

## Show

Use `Show` for conditional rendering. Pass a function to avoid evaluating heavy content while hidden.

```javascript
import Bunnix, { Show } from '@bunnix/core';

const isVisible = Bunnix.useState(false);

const Panel = () => (
    Bunnix('div', [
        Show(isVisible, () => Bunnix('p', 'Visible')),
        Bunnix('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## ForEach

`ForEach` renders a list and updates by key. You can pass the key as a string or an options object.

```javascript
const items = Bunnix.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const List = () => (
    Bunnix('ul', [
        Bunnix.ForEach(items, 'id', (item) =>
            Bunnix('li', item.label)
        )
    ])
);
```

```javascript
Bunnix.ForEach(items, { key: 'id' }, (item, index) =>
    Bunnix('li', `${index + 1}. ${item.label}`)
);
```

### Form Binding Example

You can bind input fields to items in a collection and derive form state.

```javascript
const users = Bunnix.useState([
    { id: 1, name: '' },
    { id: 2, name: '' }
]);
const disabled = users.map((list) =>
    !list.every((user) => user.name.trim().length > 0)
);

const Form = () => (
    Bunnix('form', [
        Bunnix('div', [
            Bunnix.ForEach(users, 'id', (user, index) =>
                Bunnix('input', {
                    type: 'text',
                    value: user.name,
                    change: (event) => {
                        const next = users.get().map((item, i) =>
                            i === index ? { ...item, name: event.target.value } : item
                        );
                        users.set(next);
                    }
                })
            )
        ]),
        Bunnix('button', { type: 'submit', disabled }, 'Submit')
    ])
);
```
