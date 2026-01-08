---
layout: default
title: JSX
---

# JSX

Swiftx supports JSX when your tooling compiles JSX to `Swiftx(...)` calls.

## Example

```javascript
import Swiftx from 'swiftx';

const App = () => (
    <div class="panel">
        <h1>JSX with Swiftx</h1>
        <p>Configure your compiler to use Swiftx as the JSX factory.</p>
    </div>
);

Swiftx.render(
    <App />,
    document.getElementById('root')
);
```

If you are not using JSX, the tag DSL and factory form provide the same capabilities.
