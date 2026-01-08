---
layout: default
title: Effects
---

# Effects

`useEffect` runs its callback immediately when called. This allows predictable setup before returning VDOM. It can also return a cleanup function.

## Basic Effect

```javascript
import Swiftx from 'swiftx';

Swiftx.useEffect(() => {
    console.log('Runs immediately');
}, []);
```

## Dependent Effect

```javascript
const name = Swiftx.useState('Ada');

Swiftx.useEffect((value) => {
    console.log('Name changed:', value);
}, [name]);
```

## Cleanup

```javascript
const timer = Swiftx.useState(0);

Swiftx.useEffect(() => {
    const id = setInterval(() => timer.set(timer.get() + 1), 1000);
    return () => clearInterval(id);
}, []);
```
