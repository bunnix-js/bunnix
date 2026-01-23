# Improvement Plan: Runtime Validation for Reactive Primitives

## Goal
Improve Developer Experience (DX) by enforcing type checks on arguments passed to reactive primitives. Currently, passing a primitive (e.g., string, number) to `useMemo` dependencies or `Show` results in silent failures or unexpected behavior (like arguments being shifted or ignored). We should throw clear, descriptive errors instead.

## Affected Primitives
- `useEffect` / `Effect` (Dependency Array)
- `useMemo` / `Compute` (Dependency Array)
- `Show` (Condition State)
- `ForEach` (List State)

## Proposed Technical Changes

### 1. Helper Function
Create a reusable validator in `src/utils.mjs` (or internal helper in `state.mjs`/`directives.mjs` if we want to avoid new files, but `src/internal.mjs` is a good candidate or just inline it).
*Decided: Inline or shared helper.*

```javascript
function validateState(val, contextName) {
    if (!val || typeof val.get !== 'function' || typeof val.subscribe !== 'function') {
        const type = val === null ? 'null' : typeof val;
        throw new Error(`[Bunnix] ${contextName}: Expected a State object but received ${type}. Primitives/Values are not supported.`);
    }
}
```

### 2. Update `src/state.mjs`

**Effect(cb, deps)**
- Iterate `deps`.
- Validate each item using `validateState(item, 'Effect dependency')`.
- *Note:* `deps` can be undefined (run once), but if provided as array, all items MUST be states.

**Compute(deps, fn)**
- Iterate `deps`.
- Validate each item using `validateState(item, 'Compute/useMemo dependency')`.

### 3. Update `src/directives.mjs`

**Show(state, vdom)**
- Validate `state` using `validateState(state, 'Show')`.

**ForEach(itemsState, ...)**
- Validate `itemsState` using `validateState(itemsState, 'ForEach')`.

## Implementation Details
- **Backward Compatibility:** This IS a breaking change for code that accidentally relied on silent failures (e.g. passing a static string to `useMemo` which was previously ignored). This is acceptable as it fixes a "buggy" usage pattern.
- **RefState:** Our previously implemented `RefState` has `.get` and `.subscribe`, so it passes validation.

## Verification Plan

### Test Cases
Create `tests/core/validation.test.mjs`:
1.  **Effect:** `useEffect(() => {}, [123])` -> Throws.
2.  **Compute:** `useMemo([useState(1), 'string'], ...)` -> Throws.
3.  **Show:** `Show(true, ...)` -> Throws.
4.  **ForEach:** `ForEach([1,2,3], ...)` -> Throws.
