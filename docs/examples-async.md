---
layout: default
title: Example - Async Data
---

# Example - Async Data

This example shows async data loading with `useEffect`, a loading state, and `ForEach` rendering.

```javascript
import Bunnix, { Show } from '@bunnix/core';

const loading = Bunnix.useState(true);
const items = Bunnix.useState([]);

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

Bunnix.useEffect(fetchItems, []);

const List = () => (
    Bunnix('div', [
        Bunnix('h1', 'Async Items'),
        Show(loading, Bunnix('p', 'Loading...')),
        Bunnix('ul', [
            Bunnix.ForEach(items, 'id', (item) =>
                Bunnix('li', item.title)
            )
        ])
    ])
);

Bunnix.render(
    List,
    document.getElementById('root')
);
```
