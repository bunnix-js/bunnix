---
layout: default
title: Lifecycle
---

# Lifecycle

`whenReady` schedules a callback after the current render pass completes.

```javascript
import Swiftx from 'swiftx';

Swiftx.whenReady(() => {
    console.log('DOM updated and components mounted');
});
```
