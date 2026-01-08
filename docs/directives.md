---
layout: default
title: Directives
---

# Directives

Swiftx provides two rendering directives: `Show` and `ForEach`.

## Show

Use `Show` for conditional rendering. Pass a function to avoid evaluating heavy content while hidden.

```javascript
import Swiftx, { Show } from 'swiftx';

const isVisible = Swiftx.useState(false);

const Panel = () => (
    Swiftx('div', [
        Show(isVisible, () => Swiftx('p', 'Visible')),
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## ForEach

`ForEach` renders a list and updates by key. You can pass the key as a string or an options object.

```javascript
const items = Swiftx.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const List = () => (
    Swiftx('ul', [
        Swiftx.ForEach(items, 'id', (item) =>
            Swiftx('li', item.label)
        )
    ])
);
```

```javascript
Swiftx.ForEach(items, { key: 'id' }, (item, index) =>
    Swiftx('li', `${index + 1}. ${item.label}`)
);
```
