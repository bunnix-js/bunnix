---
layout: default
title: JSX
---

# JSX

Bunnix supports JSX when your tooling compiles JSX to `Bunnix(...)` calls.

## Example

```javascript
import Bunnix from '@bunnix/core';

const App = () => (
    <div class="panel">
        <h1>JSX with Bunnix</h1>
        <p>Configure your compiler to use Bunnix as the JSX factory.</p>
    </div>
);

Bunnix.render(
    <App />,
    document.getElementById('root')
);
```

If you are not using JSX, the tag DSL and factory form provide the same capabilities.
