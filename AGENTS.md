# Bunnix Agent & Contributor Guidelines

This document provides essential guidelines for agents and contributors working on the Bunnix framework. Adhering to these principles ensures consistency, quality, and maintainability.

## Core Architectural Principles

1.  **Primitives are Simple:** Bunnix's core reactivity is built on simple, predictable primitives (`State`, `Effect`, `Compute`). They are not designed to be heavyweight or feature-rich like RxJS. They are small, fast, and follow basic observer patterns.
2.  **Explicit Reactivity:** Reactivity is opt-in and explicit.
    - Only objects that conform to the `State` interface (`.get`, `.subscribe`) are considered reactive.
    - Primitives (strings, numbers, plain objects/arrays) are **not** reactive.
    - To make a primitive reactive, it must be wrapped in a `useState()`.
3.  **Reference vs. Value Equality:** State updates are guarded by `Object.is()`.
    - For primitives (string, number, boolean), this behaves as expected (value equality).
    - For objects and arrays, this is a **reference check**. To trigger an update for an object or array, you **must** create a new one (e.g., `setState([...oldArray, newItem])`). In-place mutations (`array.push()`) will not trigger updates.
4.  **`map()` vs. `useMemo()`:** These serve different purposes.
    - **`state.map(fn)`:** The primary way to create a **derived state** from a *single* parent state. It's simple, direct, and efficient for 1:1 transformations.
    - **`useMemo(deps, fn)`:** Used to derive state from **multiple dependencies**. The dependency array can contain a mix of `State` objects and plain values. The function only re-runs when the *State* dependencies change. It is the tool for combining multiple reactive sources.

## Rules of Thumb for Development

- **No Magic:** Avoid introducing "magic" or implicit behaviors. Component function calls are standard JavaScript. If a component `function MyComp({ prop })` is called manually as `MyComp()`, it will throw a JS TypeError. The framework only intervenes when it executes VDOM objects. Components should be made robust with default props (`{ prop } = {}`) if they are intended to be called manually.
- **Testing is Mandatory:** Every bug fix or feature addition must be accompanied by tests.
    - Create new test files in `tests/core/` for new features.
    - Always run the full test suite (`npm test`) to check for regressions before committing.
- **Documentation First (for Agents):** Before implementing a change, write a clear plan in `IMPROVEMENTS.md`. This clarifies the goal, technical approach, and verification steps, ensuring alignment before code is written. Use this structure:
    1.  **Goal:** What is the high-level objective?
    2.  **Problem/Scenario:** Describe the user story or the bug.
    3.  **Root Cause:** (For bugs) Explain why the current code fails.
    4.  **Proposed Technical Changes:** Detail the code changes required.
    5.  **Verification Plan:** Outline the test cases that will validate the fix/feature.
- **Prefer Immutability:** When dealing with state, always treat values as immutable. Create new objects/arrays instead of mutating existing ones.
- **Directives are for DOM Manipulation:** `Show` and `ForEach` are low-level directives that directly manipulate the DOM. They are powerful but should be used for their specific purposes: conditional mounting/unmounting and keyed list rendering. For simple conditional logic *within* a component, standard JS (`val ? <A/> : <B/>`) is often clearer if both branches can be represented as VDOM.
