---
layout: default
title: Lifecycle
---

# Lifecycle

`whenReady` schedules a callback after the current render pass completes.

```javascript
import Bunnix from '@bunnix/core';

Bunnix.whenReady(() => {
    console.log('DOM updated and components mounted');
});
```
