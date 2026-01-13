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

## Define Routes (New API)

```javascript
import Swiftx from 'swiftx';
import { RouterRoot, RouteGroup, Route } from 'swiftx/router';

const App = () => RouterRoot(
    RouteGroup.root([
        Route('/', Home),
        Route('/user/:id', UserProfile)
    ])
);
```

## Define Routes (Legacy RouterStack)

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

## Route Terminal Actions (Legacy)

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

In the new API, params are available on `navigation.params`.

## Matching Rules

- Routes match by path segment count and order.
- `:param` segments capture values into `params`.
- The first matching rule wins.
- `Route.notFound` renders only when no other rule matches.
