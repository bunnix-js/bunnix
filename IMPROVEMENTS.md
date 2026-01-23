# Improvement Plan: Reactive `useRef`

## Goal
Transform `useRef` from a static object `{ current: null }` into a reactive primitive backed by `State`. This allows effects to subscribe to changes (like DOM attachment).

## Constraints
- `.current` must **not** be implemented as a getter/setter or Proxy. It should be a plain property.
- The value of `.current` must be kept in sync with the internal state value.

## Proposed Technical Changes

### 1. Create `RefState` in `src/state.mjs`
Create `RefState` which returns a **read-only** reactive object (no public `.set` method). To allow the framework to update the ref, we will use a global Symbol `Symbol.for('bunnix.ref.set')`.

**Logic:**
```javascript
export function RefState(initialValue) {
    const listeners = [];
    let value = initialValue;

    const setter = (v) => {
        if (Object.is(v, value)) return;
        value = v;
        state.current = v; // Sync plain property
        listeners.forEach(cb => cb(v));
    };

    const state = {
        // Plain property, synced manually
        current: value,

        // Standard Read-Only State interface
        get: () => value,
        subscribe: (cb) => {
            listeners.push(cb);
            return () => {
                const i = listeners.indexOf(cb);
                if (i > -1) listeners.splice(i, 1);
            };
        },
        
        // Internal setter for framework use only
        [Symbol.for('bunnix.ref.set')]: setter
    };
    return state;
}
```

### 2. Update `BunnixNamespace.Ref`
Update `BunnixNamespace.Ref` in `src/index.mjs` to use `RefState`.

```javascript
import { RefState } from './state.mjs';
// ...
BunnixNamespace.Ref = (initialValue) => RefState(initialValue);
```

### 3. Update `bunnixToDOM` in `src/dom.mjs`
Update the ref assignment logic to check for the internal setter symbol.

```javascript
const REF_SET_SYMBOL = Symbol.for('bunnix.ref.set');

// ... inside bunnixToDOM loop ...
if (key === 'ref') {
    if (value && typeof value[REF_SET_SYMBOL] === 'function') {
        value[REF_SET_SYMBOL](node);
    } else if (typeof value.set === 'function') {
        // Fallback if we decide to support writable refs or older interface
        value.set(node);
    } else {
        // Fallback for plain objects
        value.current = node;
    }
    continue
}
```

## Impact
- **Reading:** `ref.current` returns the value (plain property).
- **Writing (System):** `bunnixToDOM` calls `ref[Symbol.for('bunnix.ref.set')](node)`, triggering effects.
- **Writing (User):** User cannot trigger reactive updates because `.set` is not exposed. Setting `ref.current = newValue` manually will update the property but **not** trigger effects (and will be overwritten by the system on next render).
- **Reactivity:** `useEffect` works because `ref` is a `State`-like object (has `.subscribe`).

## Verification Plan

### Planned Unit Tests (Proto-code)

**Test 1: Reactivity & Read-Only Check**
```javascript
test('useRef is reactive and read-only', async () => {
    const container = document.createElement('div');
    const log = [];
    
    // 1. Setup Component with Ref and Effect
    const App = () => {
        const divRef = useRef(null);
        
        // Should run when ref changes (initial render -> attach)
        useEffect((node) => {
            log.push(node ? node.tagName : 'null');
        }, [divRef]);

        // Security Check: User cannot set it
        if (divRef.set) throw new Error('Ref should be read-only!');

        return Bunnix('div', { ref: divRef, id: 'target' });
    };

    // 2. Render
    render(App, container);
    
    // 3. Verify Effect ran with the node
    assert.deepEqual(log, ['DIV']);
    
    // 4. Verify ref.current is correct
    const divRef = ... // capture ref from component if needed, or check side effects
});
```

**Test 2: Manual .current assignment (No Reactivity)**
```javascript
test('Manual ref.current assignment does not trigger reactivity', () => {
    const ref = useRef(null);
    let count = 0;
    ref.subscribe(() => count++);

    // Manual set - acts as plain prop, no broadcast
    ref.current = 'fake'; 
    assert.equal(count, 0); 
    assert.equal(ref.current, 'fake');

    // System set (via Symbol) triggers update
    const setter = ref[Symbol.for('bunnix.ref.set')];
    setter('real');
    assert.equal(count, 1);
    assert.equal(ref.current, 'real');
});
```
