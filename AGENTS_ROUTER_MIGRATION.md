# Instructions for LLM Agents: Router Syntax Migration (Swiftx)

These instructions guide automated migrations from the legacy router syntax to
Swiftx's new router system. The target API supports `BrowserRouter`, `RouterRoot`,
`RouteGroup`, `Route`, and `RoutePolicy`, including JSX wrappers.

## Goals

- Replace `RouterStack`/`Route.on()` legacy patterns with the new router system.
- Use JSX wrappers by default (`<RouterRoot>`, `<RouteGroup>`, `<Route>`,
  `<RoutePolicy>`).
- Preserve route behavior, redirects, and layouts.
- Keep navigation calls consistent with the new API.

## Preflight Checklist

- Locate the router usage entry point(s): typically `App` or `index` files.
- Identify legacy usage patterns:
  - `RouterStack(...)` or `<RouterStack />`
  - `Route.on(...).render(...)` or `Route.notFound.render(...)`
  - guard logic in `useEffect` or route `then(...)`
  - layout handling through the RouterStack layout param
- Identify context or cookies usage in routing code.
- Confirm whether the project uses JSX (if not, use function API).

## Replacement Map (Legacy -> New)

### Router Entry

Legacy:
```js
RouterStack('/', rules, Layout)
```
New (JSX):
```jsx
<RouterRoot>
  <RouteGroup root layout={Layout}>
    {rules...}
  </RouteGroup>
</RouterRoot>
```

If there were extra non-root routes or groups, add them as siblings of the root
`RouteGroup` in `RouterRoot`.

### Routes

Legacy:
```js
Route.on('/home').render(Home)
```
New (JSX):
```jsx
<Route path="/home" component={Home} />
```

Legacy:
```js
Route.notFound.render(NotFound)
```
New (JSX):
```jsx
<Route notFound component={NotFound} />
```

### Layouts

Legacy: layout passed as last arg to RouterStack or RouteGroup.

New: layout is a `RouteGroup` prop:
```jsx
<RouteGroup root layout={RootLayout}>...</RouteGroup>
<RouteGroup rootPath="/account" layout={AccountLayout}>...</RouteGroup>
```

Layouts still receive `routerOutlet`, `navigation`, and route params.

### Policies / Guards

Legacy guard patterns:
- `Route.on('/x').then(({ navigation }) => { ... })`
- `useEffect(() => { ... navigation.replace(...) }, [])`

New:
- Use `RoutePolicy` inside a `RouteGroup`.

Example:
```jsx
<RouteGroup rootPath="/account">
  <Route path="/account" component={Account} />
  <RoutePolicy handler={({ context, navigation }) => {
    if (!context.user) navigation.replace('/login');
  }} />
</RouteGroup>
```

Policies run before rendering. If they call `navigation.replace` or `push`,
routing short-circuits.

### Context + Cookies

Legacy context was usually closed over or passed manually. New system supports
merged router context, and provides a shorthand helper:

```js
import { useRouterContext } from 'swiftx/router';

const appContext = useRouterContext({
  user: null,
  permissions: []
});
```

```jsx
<RouterRoot context={appContext}>
  ...
</RouterRoot>
```

`context` always provides:
- `context.cookies` with `get/set/remove`
- `context.set(key, value)`
- `context.remove(key)`

### Navigation API Changes

Use these fields:
- `navigation.path`
- `navigation.params`
- `navigation.group.rootPath`
- `navigation.push(path)` / `navigation.replace(path)` / `navigation.back(fallback?)`

`navigation.back()` uses group-scoped history and falls back to the group root
when no history exists. Keep link navigation inside the same group to preserve
expected history behavior.

## JSX Migration Steps

1) Replace `RouterStack` with `<RouterRoot>`.
2) Wrap root routes in `<RouteGroup root>`.
3) Move RouterStack layout into `RouteGroup` as `layout={Layout}`.
4) Convert `Route.on(...).render(...)` to `<Route path=... component=... />`.
5) Convert `Route.notFound.render(...)` and `Route.forbidden.render(...)` to
   `<Route notFound />` and `<Route forbidden />`.
6) Move guard logic into `<RoutePolicy handler={...} />` inside the appropriate
   `RouteGroup`.
7) Convert `Route.on(...).then(...)` to policy logic (or policy-only group).
8) Introduce `RouterRoot.Context(...)` if app context is used.
9) Verify `Link` usage still passes `navigation` if needed.
10) Remove legacy imports: `RouterStack`, `Route.on`, `Route.notFound.render`.

## Example Migration (Condensed)

Before:
```js
RouterStack('/', [
  Route.on('/').render(Home),
  Route.on('/login').then(({ navigation }) => {
    if (token) navigation.replace('/home');
  }),
  Route.notFound.render(NotFound)
], RootLayout);
```

After (JSX):
```jsx
<RouterRoot>
  <RouteGroup root layout={RootLayout}>
    <Route path="/" component={Home} />
    <Route path="/login" />
    <RoutePolicy handler={({ context, navigation }) => {
      const token = context.cookies.get('token');
      if (navigation.path === '/login' && token) {
        navigation.replace('/home');
      }
    }} />
  </RouteGroup>
  <Route notFound component={NotFound} />
</RouterRoot>
```

## Validation Rules

- `RouterRoot` must have exactly one root `RouteGroup` or `Route root`.
- `RouteGroup` requires `root` or `rootPath` (not both).
- `Route` cannot mix `path` with `root/notFound/forbidden`.
- `RoutePolicy` is only valid within a `RouteGroup`.

## Testing Requirements

- Run the full test suite after migration.
- Add or update router tests if you introduce new policies or navigation logic.
- Verify:
  - root match
  - group layout rendering
  - redirects through policies
  - notFound/forbidden
  - navigation.back within group history

## Output Guidelines for Agents

- Keep edits minimal and targeted.
- Use the JSX wrappers unless the project explicitly avoids JSX.
- Preserve behavior; do not reorder routes without justification.
- If any legacy route matches rely on order, keep the order.
- Document any assumptions at the end of the work.
