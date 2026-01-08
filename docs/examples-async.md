---
layout: default
title: Example - Async Data
---

# Example - Async Data

This example shows async data loading with `useEffect`, a loading state, and `ForEach` rendering.

```javascript
import Swiftx, { Show } from 'swiftx';

const loading = Swiftx.useState(true);
const items = Swiftx.useState([]);

const fetchItems = () => {
    loading.set(true);
    const id = setTimeout(() => {
        items.set([
            { id: 1, title: 'First' },
            { id: 2, title: 'Second' }
        ]);
        loading.set(false);
    }, 500);

    return () => clearTimeout(id);
};

Swiftx.useEffect(fetchItems, []);

const List = () => (
    Swiftx('div', [
        Swiftx('h1', 'Async Items'),
        Show(loading, Swiftx('p', 'Loading...')),
        Swiftx('ul', [
            Swiftx.ForEach(items, 'id', (item) =>
                Swiftx('li', item.title)
            )
        ])
    ])
);

Swiftx.render(
    List,
    document.getElementById('root')
);
```
