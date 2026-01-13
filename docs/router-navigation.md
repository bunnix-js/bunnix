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
- `navigation.path`
- `navigation.params`
- `navigation.group.rootPath`
- `navigation.currentPath` (reactive state, legacy)
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

## Redirects in useEffect

`useEffect` runs immediately. If you redirect inside an effect, the current route will not render; Swiftx will navigate straight to the destination. In dev, Swiftx logs a warning if a render is superseded by a redirect.

```javascript
import Swiftx from 'swiftx';

function GuardedRoute({ navigation }) {
    Swiftx.useEffect(() => {
        navigation.push('/login');
    }, []);

    return Swiftx('div', 'Protected content');
}
```

## Group History

`navigation.back()` uses group-scoped history in the new router. If there is no
history for the current group, it falls back to the group's root path (or the
explicit fallback you pass in).
