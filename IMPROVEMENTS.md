# Improvement Plan: Enhanced `Show` Directive

## Goal
Update the `Show` directive to support passing the unwrapped state value to the render function. This allows `Show` to act as a reactive container that can render different content based on the state's value, not just toggle visibility.

## Scenario
The user wants to achieve this pattern:
```javascript
Show(
  someStringState.map(value => (!value) || (value === "") ? "Empty String" : value),
  (value) => <span>{value}</span> 
)
```

In this scenario:
1.  The mapped state returns either `"Empty String"` or the actual string value.
2.  Both are "truthy" (non-empty strings).
3.  `Show` should render the component and pass this string to the callback: `(value) => <span>{value}</span>`.

## Current Implementation
Currently, `src/directives.mjs` calls the render function without arguments:
```javascript
const content = typeof vdom === 'function' ? vdom() : vdom;
```

## Proposed Technical Changes

### 1. Update `Show` in `src/directives.mjs`
Modify the `update` function (and the initial render block) to pass the current state value (`visible`) to the `vdom` function.

**Change:**
```javascript
// Old
const content = typeof vdom === 'function' ? vdom() : vdom;

// New
const content = typeof vdom === 'function' ? vdom(visible) : vdom;
```

### 2. Logic Analysis
- **Truthy State:** If the state is truthy (e.g., "Hello", "Empty String"), `Show` enters the "render" branch. It calls `vdom("Hello")`. The user's function receives "Hello" and returns the VDOM.
- **Falsy State:** If the state is falsy (e.g., `null`, `false`, `0`), `Show` enters the "remove" branch (`else if (!visible && el) ...`). The `vdom` function is **not** called. This preserves the conditional rendering nature of `Show`.
- **Optimization:** The existing check `if (visible === lastVisible) return;` ensures we only re-render if the value actually changes.

## Verification Plan

### Test Case: Value Passing
```javascript
test('Show passes state value to render function', () => {
    const name = useState('Alice');
    const container = document.createElement('div');

    // Use mapped state that is always truthy to test value passing
    const derived = name.map(n => n || 'Anonymous');
    
    const App = () => Show(
        derived,
        (val) => Bunnix('span', {}, `Hello ${val}`)
    );

    render(App, container);
    assert.equal(container.textContent, 'Hello Alice');

    name.set(''); // Maps to 'Anonymous'
    assert.equal(container.textContent, 'Hello Anonymous');
    
    name.set('Bob');
    assert.equal(container.textContent, 'Hello Bob');
});
```

### Test Case: Falsy Value (No Render)
Ensure that if the value is actually falsy, it still hides.
```javascript
test('Show hides content on falsy value even with arg', () => {
    const show = useState(true);
    const container = document.createElement('div');
    
    const App = () => Show(
        show,
        (val) => Bunnix('div', {}, String(val))
    );

    render(App, container);
    assert.ok(container.querySelector('div'));

    show.set(false);
    assert.equal(container.querySelector('div'), null);
});
```