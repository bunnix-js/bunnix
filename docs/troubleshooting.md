---
layout: default
title: Troubleshooting
---

# Troubleshooting

## ForEach performance with large collections

`Bunnix.ForEach` diffs keyed data by scanning every entry on each update, so even a single mutation causes the directive to walk the whole list. When the list contains hundreds of entries, this walking plus the internal `moveRange` reinsertions spikes CPU usage even though only one item changed.

### Workaround

Keep the frequently mutated entry outside of the `ForEach` render and render it next to the stable list. For example, if you only mutate the last item:

```javascript
const stableItems = allItems.slice(0, -1);
const lastItem = allItems[allItems.length - 1];

const renderLastItem = (item) =>
    Bunnix('div', {}, item.label);

return Bunnix('div', [
    Bunnix('ul', {}, Bunnix.ForEach(stableItems, 'id', (item) =>
        Bunnix('li', {}, item.label)
    )),
    renderLastItem(lastItem) // mutate this entry separately without re-running ForEach
]);
```

This keeps the `ForEach` work proportional to the stable prefix while the mutable entry is updated independently, avoiding the sweep over the full collection.
