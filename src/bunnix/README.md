# Bunnix Core

Bunnix is a ultra-lightweight, functional-first reactive UI framework. It focuses on simplicity, performance, and a "No Magic" approach to building web applications.

## Key Features

- **Functional Elements**: Define UI using standard JavaScript functions.
- **Reactive State**: Built-in state management using `Bunnix.useState`.
- **Side Effects**: Isolated side effects with `Bunnix.useEffect`.
- **Zero Dependencies**: Pure vanilla JavaScript with no external overhead.
- **Ultra-Light**: Less than 2KB gzipped.

## Getting Started

### Creating Elements
Bunnix provides a powerful Proxy-based DSL that allows you to destructure HTML tags and use them as functions. This eliminates repetitive strings and provides a cleaner, more readable UI structure.

```javascript
import Bunnix from '@bunnix/core';

// Destructure any HTML tag directly from the Bunnix object
const { div, h1, p, button } = Bunnix;

const element = (
    div({ class: 'container' }, [
        h1('Hello Bunnix!'),
        p('This is a declarative element.'),
        button({ click: () => alert('Clicked!') }, 'Click Me')
    ])
);
```

> **Note**: You can still use the traditional factory syntax if preferred: `Bunnix('div', props, children)`.


### Mounting the Application
To start your application, use the `Bunnix.render` function in your entry point file.

```javascript
import Bunnix from '@bunnix/core';
import App from './App.js';

// Mount the app to a DOM element with id="root"
Bunnix.render(App, document.getElementById('root'));
```

### State Management
```javascript
const counter = Bunnix.useState(0);

const CounterView = () => (
    Bunnix('div', [
        Bunnix('p', ['Count: ', counter]),
        Bunnix('button', { click: () => counter.set(counter.get() + 1) }, 'Increment')
    ])
);
```

### Side Effects (`useEffect`)
Isolated side effects that react to state changes. 

**Immediate Execution**: Unlike traditional frameworks, `Bunnix.useEffect` executes its callback **immediately** when called. This allows you to perform setup logic before the component returns its VDOM.

```javascript
Bunnix.useEffect(() => {
    console.log("Setting up component...");
    // If no dependencies are passed, this runs only once (immediately).
}, []);

Bunnix.useEffect((val) => {
    console.log("State changed to:", val);
}, [myState]);
```

### Directives

#### Conditional Rendering (`Show`)
The `Show` directive reactively toggles visibility based on a state atom. For performance, you can pass a **function** instead of VDOM to prevent the component from executing while hidden.

```javascript
import { Show } from '@bunnix/core';

const isVisible = Bunnix.useState(false);

const ConditionalView = () => (
    Bunnix('div', [
        // Functional approach (Recommended for complex components)
        Show(isVisible, () => Bunnix(HeavyComponent)),
        
        // Literal approach (Simple elements)
        Show(isVisible, Bunnix('p', 'Hello!')),
        
        Bunnix('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

#### Keyed Lists (`ForEach`)
Render collections from a `State` array with keyed updates. If a key is missing, Bunnix falls back to index and logs a warning.

```javascript
import Bunnix from '@bunnix/core';

const expenses = Bunnix.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const ExpenseList = () => (
    Bunnix('ul', [
        Bunnix.ForEach(expenses, 'id', (item) =>
            Bunnix('li', item.label)
        )
    ])
);
```

### Refs
Access raw DOM elements safely within your components.
```javascript
const inputRef = Bunnix.useRef();

const FocusView = () => (
    Bunnix('div', [
        Bunnix('input', { ref: inputRef, type: 'text' }),
        Bunnix('button', { click: () => inputRef.current.focus() }, 'Focus Input')
    ])
);
```

### Lifecycle Utilities (`whenReady`)
Execute logic after the current render pass is complete and the DOM has been updated.
```javascript
Bunnix.whenReady(() => {
    console.log("The DOM is now ready and components are mounted.");
});
```

## API Reference

- `Bunnix(tag, props, children)`: The VDOM factory.
- `Bunnix.[tag](props, children)`: Proxy-based tag factory for any HTML element (e.g., `Bunnix.div(...)`).
- `Bunnix.useState(initial)`: Creates a reactive state atom.
- `Bunnix.useEffect(callback, dependencies)`: Runs side effects when dependencies change.
- `Bunnix.useRef()`: Creates a persistent reference for DOM nodes (accessed via `.current`).
- `Bunnix.whenReady(callback)`: Schedules a callback to run after the next render pass.
- `Bunnix.render(vdom, container)`: Mounts the application to the DOM.
- `Bunnix.Show(state, content)`: Conditional rendering directive.
