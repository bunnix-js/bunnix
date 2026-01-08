---
layout: default
title: Example - Router Layout
---

# Example - Router Layout

A small app with a layout, scoped navigation, and dynamic params.

```javascript
import Swiftx, { BrowserRouter, RouterStack, Route, Link } from 'swiftx';

const Home = () => Swiftx('h1', 'Home');

const User = ({ params, navigation }) => (
    Swiftx('div', [
        Swiftx('h1', ['User ', params.id]),
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

const App = () => (
    RouterStack(
        '/',
        [
            Route.on('/').render(Home),
            Route.on('/user/:id').render(User),
            Route.notFound.render(() => Swiftx('h1', 'Not Found'))
        ],
        Layout
    )
);

Swiftx.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
```
