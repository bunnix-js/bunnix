# Improvement Plan: Robust Component Execution

## Goal
Make the execution of functional components in `bunnixToDOM` more robust by defaulting `props` to `{}` and `children` to `[]` if they are missing from the VDOM object.

## Reason
If a user manually constructs a VDOM object (e.g., returning `{ tag: MyComponent }` instead of using the `Bunnix` factory), `props` might be `undefined`. Invoking `MyComponent(undefined)` causes a crash if the component destructures its arguments (`function({ val })`).

## Proposed Technical Changes

### 1. Update `src/dom.mjs`
In `bunnixToDOM`, when executing a functional component, default the arguments.

**Current:**
```javascript
return bunnixToDOM(element.tag(element.props, element.children), svgContext)
```

**New:**
```javascript
return bunnixToDOM(element.tag(element.props || {}, element.children || []), svgContext)
```

## Verification Plan
1.  **Test Case:** Manually create a VDOM object without props and ensure it renders without crashing.
    ```javascript
    test('Functional component defaults to empty props if undefined', () => {
        const Comp = ({ val }) => Bunnix('div', {}, val || 'default');
        const vdom = { tag: Comp }; // No props property
        const container = document.createElement('div');
        render(vdom, container);
        assert.equal(container.textContent, 'default');
    });
    ```
