---
layout: default
title: Routes
---

# Routes

Define routes with `RouterRoot`, `RouteGroup`, and `Route`.

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
import Swiftx from 'swiftx';
import { RouterRoot, RouteGroup, Route } from 'swiftx/router';

const App = () => (
    <RouterRoot>
        <RouteGroup root>
            <Route path="/" component={Home} />
            <Route path="/user/:id" component={UserProfile} />
        </RouteGroup>
    </RouterRoot>
);
```

## Route Policies

Policies run before rendering and can redirect based on context.

```javascript
import { RouterRoot, RouteGroup, RoutePolicy, Route } from 'swiftx/router';

const App = () => (
    <RouterRoot>
        <RouteGroup rootPath="/account">
            <Route path="/account" component={Account} />
            <RoutePolicy handler={({ context, navigation }) => {
                if (!context.user) navigation.replace('/login');
            }} />
        </RouteGroup>
    </RouterRoot>
);
```

## Dynamic Params

`params` includes dynamic segments from the URL.

```javascript
function UserProfile({ params }) {
    return Swiftx('h1', ['User ', params.id]);
}
```
Params are available on `navigation.params`.

## Matching Rules

- Routes match by path segment count and order.
- `:param` segments capture values into `params`.
- The first matching rule wins.
- `Route.notFound` renders only when no other rule matches.
