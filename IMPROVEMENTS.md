# Improvement Plan: Enhance `useMemo` for Mixed Dependencies

## Goal
Fix `useMemo` (`Compute`) to properly handle dependency arrays that contain a mix of **State objects** and **plain values** (e.g., strings, numbers, plain arrays/objects). This makes its behavior more intuitive and aligns it with the user's expectations from other frameworks.

## Problem & Scenario
Currently, `useMemo` silently filters out any non-State values from its dependency array.

**Scenario:** A user wants to filter a plain `data` array based on a reactive `searchText` state.
```javascript
const plainData = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];
const searchText = useState('');

// This currently FAILS because `plainData` is filtered out
const filtered = useMemo(
  [searchText, plainData], 
  (text, data) => data.filter(item => item.name.includes(text))
);
```
**Current Behavior:** The `useMemo` callback receives `(text, undefined)` because `plainData` is not a State, causing a crash or incorrect filtering.

## Root Cause
The current implementation of `Compute` in `src/state.mjs` explicitly removes non-State objects from the dependency list before passing their values to the memoization function.

```javascript
// src/state.mjs
const states = rawDeps.filter(s => s && typeof s.get === 'function' && typeof s.subscribe === 'function')
const computeValue = () => fn(...states.map(s => s.get())) // Only uses filtered states
```

## Proposed Technical Changes

### Modify `Compute` in `src/state.mjs`
We will refactor `Compute` to correctly handle mixed-dependency arrays.

**New Logic:**
1.  **Iterate** through the raw dependency array (`rawDeps`).
2.  For each dependency, check if it's a `State`.
3.  **Subscribe** the `update` function only to the dependencies that are `State` objects.
4.  When computing the value (both initially and on updates), map over the **entire** `rawDeps` array, unwrapping `State` values with `.get()` and passing plain values through as-is.

**Implementation:**
```javascript
export function Compute(deps, fn) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : [];

    const isState = (s) => s && typeof s.get === 'function' && typeof s.subscribe === 'function';

    const getValues = () => rawDeps.map(dep => isState(dep) ? dep.get() : dep);

    const derived = State(fn(...getValues()));

    const update = () => {
        derived.set(fn(...getValues()));
    };

    // Only subscribe to the actual states
    rawDeps.forEach(dep => {
        if (isState(dep)) {
            dep.subscribe(update);
        }
    });

    return toReadonly(derived);
}
```

## Verification Plan

### Test Cases
Create a new test file `tests/core/compute_mixed.test.mjs`:

1.  **Mixed Dependencies Test:** Verify the scenario from the problem description now works correctly.
    ```javascript
    test('useMemo works with mixed state and plain value dependencies', () => {
        const data = ['Apple', 'Banana', 'Avocado'];
        const search = useState('A');
        
        const filtered = useMemo(
            [search, data], 
            (s, d) => d.filter(item => item.startsWith(s))
        );

        assert.deepEqual(filtered.get(), ['Apple', 'Avocado']);

        search.set('B');
        assert.deepEqual(filtered.get(), ['Banana']);
    });
    ```
2.  **Regression Test:** Ensure `useMemo` still works correctly when all dependencies are States.
    ```javascript
    test('useMemo still works with all-state dependencies', () => {
        const a = useState(1);
        const b = useState(2);
        const sum = useMemo([a, b], (valA, valB) => valA + valB);
        
        assert.equal(sum.get(), 3);
        a.set(10);
        assert.equal(sum.get(), 12);
    });
    ```
