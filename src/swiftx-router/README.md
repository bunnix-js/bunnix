# Swiftx Router

A decentralized, context-aware routing solution for the Swiftx framework.

## Key Features

- **Route Groups**: Organize routes with shared policies and layouts.
- **Policies**: Centralize guard logic with `RoutePolicy`.
- **Scoped Navigation**: Navigation is injected into components and layouts.
- **Dynamic Parameters**: Parse URL segments like `:id` automatically.
- **Layout Support**: Persistent layouts with `routerOutlet`.

## Bootstrap
To enable routing, you must wrap your root component in the `BrowserRouter` when calling the render function.

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

## Example Usage

### Setting up the Router
```javascript
import Swiftx from 'swiftx';
import { RouterRoot, RouteGroup, Route, Link } from 'swiftx/router';

const App = () => (
    <RouterRoot>
        <RouteGroup root layout={AppLayout}>
            <Route path="/" component={Home} />
            <Route path="/user/:id" component={UserProfile} />
        </RouteGroup>
        <Route notFound component={NotFound} />
    </RouterRoot>
);
```

### Router Context Helper

```javascript
import { useRouterContext } from 'swiftx/router';

const appContext = useRouterContext({
    user: null,
    permissions: []
});
```

### Policies
Policies run before rendering and can redirect.

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

### Layouts & Router Outlet
Layouts allow you to wrap your routes with persistent UI (like navbars or sidebars). A layout component receives two special props: `routerOutlet` and `navigation`.

```javascript
import { Link } from 'swiftx';

/**
 * @param {Function} props.routerOutlet - A function that returns the matched route content.
 * @param {Object} props.navigation - The scoped navigation object.
 */
function AppLayout({ routerOutlet, navigation }) {
    return Swiftx('div', { class: 'layout' }, [
        Swiftx('nav', [
            Link({ to: '/', navigation }, 'Home'),
            Link({ to: '/form', navigation }, 'Form')
        ]),
        Swiftx('main', [
            // Call the outlet to render the matched route component
            routerOutlet()
        ])
    ]);
}
```

#### With vs Without Layout
- **With Layout**: The `RouteGroup` renders the layout component. The matched route is **not** visible until you call `props.routerOutlet()` inside the layout's VDOM.
- **Without Layout**: The matched route component renders directly as its only content.


### Consuming Navigation
Matched components and layouts receive the `navigation` object.

```javascript
function Home({ navigation }) {
    return Swiftx('div', [
        Swiftx('h1', 'Home Page'),
        Swiftx('button', { 
            click: () => navigation.push('/user/123') 
        }, 'View User')
    ]);
}
```

### Navigation Object Reference

- `navigation.push(path)`: Navigates to a new URL.
- `navigation.replace(path)`: Replaces the current history entry.
- `navigation.back(fallback?)`: Goes back in history or to the fallback (defaults to `rootPath`).
- `navigation.path`: Current path string.
- `navigation.params`: Current route params.
- `navigation.group.rootPath`: Current group root path.

## Components

- `BrowserRouter`: The root container for your routing tree.
- `RouterRoot`: Defines the router tree.
- `RouteGroup`: Defines grouped routes with layouts and policies.
- `RoutePolicy`: Guards for group routes.
- `Link`: A helper component for declarative navigation: `Link({ to: '/path', navigation }, 'Label')`.
