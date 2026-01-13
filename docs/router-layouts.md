---
layout: default
title: Layouts
---

# Layouts

Layouts let you wrap routes with persistent UI such as headers or sidebars. Layout components receive `routerOutlet`, `navigation`, and any matched route params.

With the new API, layouts are defined per `RouteGroup`, so each group can have its own wrapper.

## Layout Example

```javascript
import Swiftx, { Link } from 'swiftx';

function AppLayout({ routerOutlet, navigation, accountId }) {
    return Swiftx('div', { class: 'layout' }, [
        Swiftx('header', ['Account: ', accountId]),
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

## Group Layouts (New API)

```javascript
import { RouterRoot, RouteGroup, Route } from 'swiftx/router';

const App = () => RouterRoot(
    RouteGroup('/dashboard', [
        Route('/dashboard', Dashboard),
        Route('/dashboard/settings', Settings)
    ], [], DashboardLayout)
);
```
