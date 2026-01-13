# Router System Migration Plan (Incremental)

This document outlines a phased, low-risk migration path to the new router system
described in `ROUTER_SYSTEM_CHANGES.md`. Each phase introduces the smallest
impactful surface area first, then progressively adds structural changes. The
final phase includes a migration guide from the old RouterStack/Route API to the
new RouterRoot/RouteGroup system.

Each phase lists:
- **Goals**: what we introduce in that phase.
- **Changes**: code/documentation work.
- **Tests**: which unit tests to add/adjust.
- **Exit Criteria**: what must be true to advance.

---

## Phase 0: Baseline + Inventory (No Functional Change)

**Goals**
- Capture current router behavior and test coverage.
- Add regression tests for known edge cases in the current system.
- Ensure documentation inventory is complete.

**Changes**
- Audit current router modules:
  - `src/swiftx-router/router-stack.mjs`
  - `src/swiftx-router/browser-router.mjs`
  - `src/swiftx-router/route.mjs` (or similar)
- Add a README-style summary under `docs/router.md` (no behavioral change).
- Document current router API and behavior as-is.

**Tests**
- Ensure tests cover:
  - simple matching,
  - layout outlet rendering,
  - redirects inside `useEffect`,
  - Link navigation,
  - route parameter injection.
- Keep the weak-control tests as they currently pass.

**Exit Criteria**
- All existing tests pass without changes to router behavior.
- Router behavior documented as current reference.

---

## Phase 1: Internal Model for Groups/Policies (Hidden)

**Goals**
- Introduce internal structures for `RouterRoot`, `RouteGroup`, `RoutePolicy`
  without changing public API.
- Create compatibility wrappers that map existing RouterStack to these internals.

**Changes**
- Add new internal types (no exports yet):
  - `createRouterRootModel`
  - `createRouteGroupModel`
  - `createRoutePolicyModel`
- RouterStack should build this internal model and run matching through it.
- No new runtime behavior; adapter should produce identical results.

**Tests**
- Run existing router tests unchanged.
- Add 1-2 internal model unit tests (if possible without public API).

**Exit Criteria**
- RouterStack routes still behave identically.
- No changes needed in apps/tests.

---

## Phase 2: Public API Introduction (Opt-In)

**Goals**
- Export `RouterRoot`, `RouteGroup`, `RoutePolicy` from `swiftx/router`.
- Allow apps to opt into the new API without breaking the old API.

**Changes**
- Add new module exports:
  - `RouterRoot`, `RouteGroup`, `RoutePolicy`, `Route` (new signature).
- Implement `Route` overloads:
  - `Route(path, component?)`
  - `Route.root(component?)`
  - `Route.notFound(component)`
  - `Route.forbidden(component)`
- Add `Swiftx.Router` proxy (short syntax) matching the spec.

**Tests**
- New tests for:
  - RouterRoot with only root route.
  - RouterRoot + extra routes.
  - RouteGroup root + policies.
  - Route.forbidden and Route.notFound navigation.
- Ensure old RouterStack tests still pass.

**Exit Criteria**
- New API works in parallel with old API.
- No regressions in old API tests.

---

## Phase 3: Context System + Cookies Integration

**Goals**
- Provide the default `context` object with:
  - `context.cookies` (get/set/remove),
  - `context.set`,
  - `context.remove`.
- Allow RouterRoot to merge app context into defaults.

**Changes**
- Implement `RouterRoot.Context` helper (as spec).
- Add Cookies utility (memory-backed for tests, real cookies for browser).
- Expose `context` to policies and route components.

**Tests**
- Add unit tests for:
  - context merging,
  - cookies get/set/remove,
  - policy access to context and cookies.
- Ensure no changes to RouterStack tests (still pass).

**Exit Criteria**
- New context helper works in RouterRoot.
- Existing RouterStack behavior unchanged.

---

## Phase 4: Policy Execution + Group Scoping

**Goals**
- Enable policy execution order:
  - Root group policies → group policies → route match.
- Support group root path scoping and group-level layouts.
- Introduce per-group navigation state (`navigation.group.rootPath`).

**Changes**
- Implement policy runner:
  - Policies can redirect via `navigation.push/replace`.
  - Ensure render short-circuits when redirect happens.
- Implement group match resolution with priority rules.
- Navigation updates:
  - `navigation.path` (reactive),
  - `navigation.params` (reactive),
  - `navigation.group.rootPath` (reactive).

**Tests**
- Add policy redirect tests:
  - redirect on missing token,
  - forbidden route.
- Add group scoping tests:
  - group history isolation for `.back()`,
  - group root fallback on empty history.
- Add tests for layout rendering per group.

**Exit Criteria**
- Policies and groups work in new API.
- Old RouterStack unchanged.

---

## Phase 5: Navigation History Per Group

**Goals**
- Implement group-scoped history for `navigation.back()`.
- Ensure fallback to group root when no history.

**Changes**
- Track history entries per group root path.
- Update `navigation.back()` logic to consult group history.
- Ensure `navigation.back(fallback)` works as specified.

**Tests**
- Add tests for:
  - back within group,
  - back with empty history to group root,
  - back with explicit fallback path.

**Exit Criteria**
- Group-scoped back behaves as spec.

---

## Phase 6: Compatibility Layer + Deprecations

**Goals**
- Provide compatibility between RouterStack and RouterRoot.
- Begin soft deprecation warnings (dev only).

**Changes**
- Implement RouterStack as thin wrapper around RouterRoot (internals).
- Add dev-only warnings for legacy usage (optional, if desired).
- Keep old exports and behavior stable.

**Tests**
- Ensure all legacy tests still pass.
- Add a test to confirm legacy RouterStack still routes correctly.

**Exit Criteria**
- Both APIs work concurrently.
- No behavior regressions.

---

## Phase 7: Docs + Migration Guide

**Goals**
- Create a complete migration guide.
- Document new RouterRoot / RouteGroup API.
- Document policies, context, cookies, and navigation changes.

**Changes**
- Add `docs/router-migration.md` with:
  - before/after examples,
  - RouterStack → RouterRoot mapping,
  - policies and context examples,
  - route groups and layouts,
  - navigation changes.
- Update router docs:
  - `docs/router.md`, `docs/router-navigation.md`, `docs/router-layouts.md`
  - Add new page to sidebar.

**Tests**
- No new tests; ensure docs changes do not affect build if doc build exists.

**Exit Criteria**
- Migration guide complete and linked.
- New docs reflect actual implementation.

---

## Phase 8: Stabilization + Cleanup

**Goals**
- Remove deprecated branches only after full migration.
- Ensure all tests are stable and timing-safe.

**Changes**
- Remove redundant internals if no longer needed.
- Finalize any lint or formatting updates.

**Tests**
- Run full test suite (including router tests).
- Add test timeouts only if supported by target Node versions.

**Exit Criteria**
- Stable release-ready router system.
- All tests pass in CI and local.

---

## Final Deliverable: Migration Documentation

At the end of Phase 7, generate a migration guide that explains:
- How to move from `RouterStack` and `Route.on()` to `RouterRoot`, `RouteGroup`,
  and `Route`.
- How to update layouts with `routerOutlet` in the new system.
- How to replace guard logic in `useEffect` with `RoutePolicy`.
- How to migrate to new context and cookies APIs.
- How to update navigation usage (`navigation.path`, `navigation.params`,
  `navigation.group.rootPath`).
- Test adjustments and how to validate the migration.
