# Improvement Plan: Document Show value-passing behavior

## Goal
Make the `Show` directive's value-passing behavior discoverable in the public documentation.

## Problem/Scenario
The current documentation presents `Show` only as a boolean-style conditional rendering helper. That makes it easy to miss that `Show` also passes the current truthy state value into the render callback, which is useful for object and string states.

## Root Cause
The runtime already supports passing the current truthy state value to the render callback, but the documentation examples only demonstrate hidden/visible toggling with booleans.

## Proposed Technical Changes
1. Update `README.md` with a `Show` example that renders from an object-valued state.
2. Update `docs/directives.md` with a short explanation and example showing that the callback receives the current truthy value.

## Verification Plan
- Review the new examples in `README.md` and `docs/directives.md` for clarity and consistency with the existing API.
- Confirm the examples match the runtime behavior covered by `tests/core/show_value_passing.test.mjs`.
