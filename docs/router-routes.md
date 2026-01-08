---
layout: default
title: Routes
---

# Routes

Define routes with the fluent `Route` API and register them in a `RouterStack`.

## Bootstrap

```javascript
import Swiftx, { BrowserRouter } from 'swiftx';
import App from './App.js';

Swiftx.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
```

## Define Routes

```javascript
import Swiftx, { RouterStack, Route } from 'swiftx';

const App = () => (
    RouterStack(
        '/',
        [
            Route.on('/').render(Home),
            Route.on('/user/:id').render(UserProfile),
            Route.notFound.render(NotFound)
        ]
    )
);
```

## Route Terminal Actions

A route rule must end with either `.render()` or `.then()`.

- `.render(Component|VDOM)` renders content into the router outlet.
- `.then((navigation, params) => { ... })` runs side effects.

```javascript
Route.on('/legacy').then((navigation) => {
    navigation.replace('/new');
});
```

## Dynamic Params

`params` includes dynamic segments from the URL.

```javascript
function UserProfile({ params }) {
    return Swiftx('h1', ['User ', params.id]);
}
```
