---
layout: default
title: Router Migration
---

# Router Migration Guide

This guide walks through moving from the legacy `RouterStack`/`Route.on()` API to the
new `RouterRoot`/`RouteGroup`/`Route` system.

## Quick Mapping

- `RouterStack` -> `RouterRoot`
- `Route.on('/path').render(Component)` -> `Route('/path', Component)`
- `Route.notFound.render(Component)` -> `Route.notFound(Component)`
- layout stays the same (`routerOutlet()`), but moves to the group
- guard logic moves from `useEffect` to `RoutePolicy`

## Before and After

### Legacy

```javascript
import Swiftx, { RouterStack, Route } from 'swiftx';

const App = () => RouterStack(
  '/',
  [
    Route.on('/').render(Home),
    Route.on('/account').render(Account),
    Route.notFound.render(NotFound)
  ],
  AppLayout
);
```

### New API

```javascript
import Swiftx from 'swiftx';
import { RouterRoot, RouteGroup, Route, RoutePolicy } from 'swiftx/router';

const App = () => RouterRoot(
  RouteGroup.root(
    [
      Route('/', Home),
      Route('/account', Account)
    ],
    [],
    AppLayout
  ),
  [
    Route.notFound(NotFound)
  ]
);
```

## Layouts with `routerOutlet`

Layouts still receive `routerOutlet` and `navigation`, but are now defined per group:

```javascript
const App = () => RouterRoot(
  RouteGroup('/dashboard', [
    Route('/dashboard', Dashboard),
    Route('/dashboard/settings', Settings)
  ], [], DashboardLayout)
);
```

## Replacing `useEffect` Guards with `RoutePolicy`

Legacy guard logic often runs in `useEffect`:

```javascript
function Account({ navigation }) {
  Swiftx.useEffect(() => {
    if (!window.__user) navigation.replace('/login');
  }, []);
  return Swiftx('div', {}, 'Account');
}
```

Use a group policy instead:

```javascript
RouteGroup('/account', [
  Route('/account', Account)
], [
  RoutePolicy(({ context, navigation }) => {
    if (!context.user) navigation.replace('/login');
  })
])
```

## Context and Cookies

Use `RouterRoot.Context` to merge defaults with app data:

```javascript
const appContext = RouterRoot.Context({
  user: null,
  permissions: []
});

const App = () => RouterRoot(appContext, Route.root(Home));
```

Context always provides:

- `context.cookies.get/set/remove`
- `context.set(key, value)`
- `context.remove(key)`

## Navigation Updates

New properties on the navigation object:

- `navigation.path` (current path string)
- `navigation.params` (current params object)
- `navigation.group.rootPath` (current group root)

You can now redirect to special routes:

```javascript
navigation.replace(Route.notFound);
navigation.replace(Route.forbidden);
```

Group history is isolated for `navigation.back()`; when history is empty it falls back
to the current group root (or a provided fallback).

## Test Adjustments

- Prefer `RouterRoot` + `RouteGroup` in new tests.
- Add group policy tests using `RoutePolicy`.
- Validate `navigation.path`, `navigation.params`, and `navigation.group.rootPath` in
  group routes.
- For legacy tests, `RouterStack` continues to work unchanged.
