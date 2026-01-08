---
layout: default
title: Layouts
---

# Layouts

Layouts let you wrap routes with persistent UI such as headers or sidebars. Layout components receive `routerOutlet` and `navigation`.

## Layout Example

```javascript
import Swiftx, { Link } from 'swiftx';

function AppLayout({ routerOutlet, navigation }) {
    return Swiftx('div', { class: 'layout' }, [
        Swiftx('nav', [
            Link({ to: '/', navigation }, 'Home'),
            Link({ to: '/settings', navigation }, 'Settings')
        ]),
        Swiftx('main', [
            routerOutlet()
        ])
    ]);
}
```

## Attach a Layout

```javascript
import Swiftx, { RouterStack, Route } from 'swiftx';

const App = () => (
    RouterStack(
        '/',
        [
            Route.on('/').render(Home),
            Route.on('/settings').render(Settings)
        ],
        AppLayout
    )
);
```

With a layout, route content renders only where `routerOutlet()` is called. Without a layout, `RouterStack` renders the matched route directly.
