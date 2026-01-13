# JSX Router System Plan

This plan defines how to introduce JSX wrapper components for the new Swiftx
router system while keeping the existing function-based API stable. The goal is
an ergonomic JSX syntax that compiles directly to the current RouterRoot,
RouteGroup, Route, and RoutePolicy functions with no behavioral changes.

Each phase lists:
- **Goals**: what we introduce in that phase.
- **Changes**: code/documentation work.
- **Tests**: which unit tests to add/adjust.
- **Exit Criteria**: what must be true to advance.

---

## Phase 0: Inventory + Contract Definition

**Goals**
- Lock down the JSX wrapper API contract (props, children rules, error cases).
- Ensure the wrappers are strictly a thin layer over current functions.

**Changes**
- Define supported JSX components and their prop shapes:
  - `RouterRoot` (component wrapper)
  - `RouteGroup`
  - `Route`
  - `RoutePolicy`
- Define child normalization rules (single/array, mix of routes/policies).
- Define error handling rules for invalid combinations.

**Tests**
- No tests yet (design-only phase).

**Exit Criteria**
- JSX API contract accepted and documented in this plan.

---

## Phase 1: Wrapper Components (Opt-In)

**Goals**
- Implement JSX wrappers without changing runtime behavior.
- Ensure wrappers work alongside existing function-based API.

**Changes**
- Add wrapper components to `swiftx/router` exports:
  - `RouterRootJSX` or `RouterRoot` (if conflict-free)
  - `RouteGroup`
  - `Route`
  - `RoutePolicy`
- Implement a JSX node parser that:
  - Flattens children arrays.
  - Extracts `Route`, `RouteGroup`, and `RoutePolicy` nodes.
  - Validates root presence and invalid prop combos.
- Map JSX wrappers to existing functions:
  - `<RouterRoot>` -> `RouterRoot(context?, rootGroupOrRoute, extra)`
  - `<RouteGroup root>` -> `RouteGroup.root(...)`
  - `<RouteGroup rootPath="/x">` -> `RouteGroup('/x', ...)`
  - `<Route>` -> `Route(...)` / `Route.root(...)` / `Route.notFound(...)` / `Route.forbidden(...)`
  - `<RoutePolicy>` -> `RoutePolicy(handler)`

**Tests**
- Add JSX wrapper tests:
  - `RouterRoot` with root group only.
  - `RouterRoot` with root group + extra groups/routes.
  - `RouteGroup` with `policies` prop + `<RoutePolicy>` children.
  - `Route` `root`, `notFound`, `forbidden` variants.
  - Layout rendering and routerOutlet behavior.

**Exit Criteria**
- JSX wrappers functionally equivalent to direct function calls.
- All existing router tests pass unchanged.

---

## Phase 2: Types + JSX Ergonomics

**Goals**
- Provide JSX/TS typing support for wrappers.
- Ensure JSX usage is type-safe and discoverable.

**Changes**
- Update `src/swiftx-router/index.d.ts`:
  - Add JSX intrinsic element types for wrappers.
  - Add prop types for `RouterRoot`, `RouteGroup`, `Route`, `RoutePolicy`.
- Ensure no conflicts with existing `RouterRoot` function types.

**Tests**
- No runtime tests required.
- Optional type-checking if TS tooling exists.

**Exit Criteria**
- Type definitions compile and match wrapper behavior.

---

## Phase 3: Documentation + Examples

**Goals**
- Make JSX the default documented syntax.
- Keep function API documented as an alternative.

**Changes**
- Update docs to show JSX wrappers:
  - `docs/router.md`
  - `docs/router-routes.md`
  - `docs/router-layouts.md`
  - `docs/router-navigation.md`
  - `src/swiftx-router/README.md`
  - Root `README.md`
- Add a dedicated JSX example page if needed.

**Tests**
- No new tests; ensure doc build (if any) passes.

**Exit Criteria**
- Docs match actual JSX behavior.

---

## Phase 4: Stabilization

**Goals**
- Finalize wrapper behavior and error messages.
- Ensure tests cover regressions for JSX usage.

**Changes**
- Add negative-case tests (invalid prop combos, missing root).
- Ensure warnings/errors are consistent and actionable.

**Tests**
- Full test suite.

**Exit Criteria**
- JSX wrappers stable and release-ready.

---

# JSX API Contract (Proposed)

## RouterRoot (JSX)
```jsx
<RouterRoot context={appContext}>
  <RouteGroup root layout={AppLayout}>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <RoutePolicy handler={policyFn} />
  </RouteGroup>

  <RouteGroup rootPath="/account" layout={AccountLayout} policies={[policyFn]}>
    <Route path="/account" component={Account} />
  </RouteGroup>

  <Route notFound component={NotFound} />
  <Route forbidden component={Forbidden} />
</RouterRoot>
```

**Props**
- `context?`: result of `RouterRoot.Context(...)` (optional).
- `children`: `RouteGroup`, `Route`, `RoutePolicy` (policies only via groups).

## RouteGroup (JSX)
```jsx
<RouteGroup root layout={Layout} policies={[policyFn]}>
  <Route path="/x" component={X} />
  <RoutePolicy handler={policyFn2} />
</RouteGroup>
```

**Props**
- `root` (boolean) OR `rootPath` (string). Exactly one required.
- `layout?`: layout component.
- `policies?`: array of policy handlers.
- `children`: `Route` and `RoutePolicy` nodes.

## Route (JSX)
```jsx
<Route path="/account/:id" component={Account} />
<Route root component={Home} />
<Route notFound component={NotFound} />
<Route forbidden component={Forbidden} />
```

**Props**
- `path?`: string, required unless `root`/`notFound`/`forbidden`.
- `component?`: component function.
- `root` boolean -> `Route.root`.
- `notFound` boolean -> `Route.notFound`.
- `forbidden` boolean -> `Route.forbidden`.

## RoutePolicy (JSX)
```jsx
<RoutePolicy handler={({ context, navigation }) => { ... }} />
```

**Props**
- `handler`: policy function.

---

# Validation Rules

- `RouterRoot` must have exactly one root group or root route.
- `RouteGroup` must define exactly one of `root` or `rootPath`.
- `Route` cannot combine `path` with `root`/`notFound`/`forbidden`.
- `Route.notFound` and `Route.forbidden` require a `component`.
- `RoutePolicy` can only appear inside a `RouteGroup`.

---

# Tests (Target List)

- JSX root group and extra groups/routes.
- Policies from `policies` prop and `<RoutePolicy>` children.
- Layouts and `routerOutlet` rendering.
- `notFound` and `forbidden` behavior.
- Navigation behavior unchanged.
- Negative cases for invalid JSX usage.

