---
layout: default
title: Example - Router Layout
---

# Example - Router Layout

A small app with a layout, scoped navigation, and dynamic params.

```javascript
import Swiftx from 'swiftx';
import { BrowserRouter, RouterRoot, RouteGroup, Route, Link } from 'swiftx/router';

const Home = () => Swiftx('h1', 'Home');

const User = ({ navigation }) => (
    Swiftx('div', [
        Swiftx('h1', ['User ', navigation.params.id]),
        Swiftx('button', { click: () => navigation.back('/') }, 'Back')
    ])
);

function Layout({ routerOutlet, navigation }) {
    return Swiftx('div', { class: 'layout' }, [
        Swiftx('nav', [
            Link({ to: '/', navigation }, 'Home'),
            Link({ to: '/user/42', navigation }, 'User 42')
        ]),
        Swiftx('main', [routerOutlet()])
    ]);
}

const App = () => RouterRoot(
    RouteGroup.root(
        [
            Route('/', Home),
            Route('/user/:id', User)
        ],
        [],
        Layout
    ),
    [
        Route.notFound(() => Swiftx('h1', 'Not Found'))
    ]
);

Swiftx.render(
    Swiftx(BrowserRouter, {}, Swiftx(App)),
    document.getElementById('root')
);
```
