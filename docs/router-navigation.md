---
layout: default
title: Navigation
---

# Navigation

Matched components and layouts receive a scoped `navigation` object.

## Navigation API

- `navigation.push(path)`
- `navigation.replace(path)`
- `navigation.back(fallback?)`
- `navigation.currentPath` (reactive state)
- `navigation.rootPath`

## Using navigation in a Component

```javascript
function Home({ navigation }) {
    return Swiftx('div', [
        Swiftx('h1', 'Home'),
        Swiftx('button', { click: () => navigation.push('/profile') }, 'Profile')
    ]);
}
```

## Declarative Links

```javascript
import { Link } from 'swiftx';

const Nav = ({ navigation }) => (
    Swiftx('nav', [
        Link({ to: '/', navigation }, 'Home'),
        Link({ to: '/profile', navigation }, 'Profile')
    ])
);
```

## Reactive Current Path

`navigation.currentPath` is a reactive state atom.

```javascript
function Breadcrumbs({ navigation }) {
    return Swiftx('p', ['Path: ', navigation.currentPath]);
}
```
