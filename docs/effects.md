---
layout: default
title: Effects
---

# Effects

`useEffect` runs its callback immediately when called. This allows predictable setup before returning VDOM. It can also return a cleanup function.

## Basic Effect

```javascript
import Bunnix from '@bunnix/core';

Bunnix.useEffect(() => {
    console.log('Runs immediately');
}, []);
```

## Dependent Effect

```javascript
const name = Bunnix.useState('Ada');

Bunnix.useEffect((value) => {
    console.log('Name changed:', value);
}, [name]);
```

## Cleanup

```javascript
const timer = Bunnix.useState(0);

Bunnix.useEffect(() => {
    const id = setInterval(() => timer.set(timer.get() + 1), 1000);
    return () => clearInterval(id);
}, []);
```
