---
layout: default
title: Bunnix Pitch Paper
---

# **Bunnix: High-Performance Web UI Engineering via Atomic Reactivity**

Have you noticed how frontend development reached a point where we spend more time on abstraction, performance tuning, and code maintenance than on real productivity gains? **Bunnix** is a pragmatic alternative for teams that want something as declarative as React, but with less friction: fewer dependencies, simpler maintenance, and predictable responsiveness even as component complexity grows. The idea is to treat the framework as a browser facilitator, not an isolated execution layer, prioritizing runtime efficiency, sovereign security, and technical transparency.

**Based on:** January 14, 2026.

## **1. Introduction**

Today, performance is no longer just a technical desire; it is a product metric. And with recent security incidents across the frontend ecosystem, it is clear that relying on massive dependency trees also carries real cost. Applications that consume less memory, keep runtime dependencies low, and respond instantly retain more users and reduce operational costs. For technical leaders, **Bunnix** is a direct response to modern tooling bloat, delivering a solid foundation that does not rely on huge dependency trees or heavy reconciliation algorithms. What started as a personal case evolved into an opportunity for projects that demand longevity, better maintainability, and maximum agility under any user hardware condition.

## **2. Technical Architecture: Direct Reactivity**

Bunnix takes a direct approach that questions the common dogmas of the past decade. Instead of fighting the DOM, it integrates with it precisely.

### **2.1 Less Virtual DOM**

Unlike the market pattern that keeps a persistent virtual representation in memory, Bunnix uses the VDOM only as an initial build scheme. After real nodes are created, that virtual tree is discarded, freeing resources.

### **2.2 Direct Performance (Less Overhead)**

By removing constant diffing, the time between a data change and the visual update is reduced to the smallest possible unit. Updates are atomic and applied directly to the affected DOM node.

### **2.3 Fewer Re-renders**

In traditional architectures, a state change can shake an entire component tree. In Bunnix, components are single-run functions. What reacts are the bindings between state atoms and elements, eliminating redundant processing.

### **2.4 End of Synthetic Props**

Bunnix removes the property translation layer. By using native HTML attributes and events, it avoids synthetic event overhead and immediately supports new browser APIs (like popover or inert) without core updates.

## **3. Code, First**

Bunnix lets the team choose the expression style while keeping the same low-level performance.

### **3.1 Core Factory Syntax**

The foundation is a simple Core Factory that does not require any build tooling to work.

```js
import Bunnix, { useState } from '@bunnix/core';

const Header = () => {
    const title = useState('Bunnix Core');
    return Bunnix('header', { class: 'main-header' }, [
        Bunnix('h1', title)
    ]);
};
```

### **3.2 Tag DSL: Less Code, More Compatibility**

The Tag DSL provides a clean declarative style, close to modern UI languages like SwiftUI and Jetpack Compose. It coexists with legacy code without a transpiler.

```js
const { div, h1, button } = Bunnix;

const Card = () => (
    div({ class: 'card' }, [
        h1('Declarative Architecture'),
        button({ click: () => alert('Direct Action!') }, 'Interact')
    ])
);
```

### **3.3 JSX: Why Not?**

For teams that prefer XML-like syntax, Bunnix supports JSX as a render factory. It only needs a small config change in your transpiler (Babel, SWC, or Vite), setting the jsxFactory to Bunnix.

```js
import Bunnix, { useState } from '@bunnix/core';

const Counter = () => {
    const count = useState(0);

    return (
        <div class="counter-panel">
            <h1>JSX with Bunnix</h1>
            <p>Count: {count}</p>
            <button click={() => count.set(count.get() + 1)}>Increment</button>
        </div>
    );
};
```

## **4. The Pillars**

* **4.1 State and Atoms:** State is a living object (Atom). It can be nested, allowing sub-properties to be reactive independently.
* **4.2 Side Effects and Optimized Computation:** useEffect and useMemo react only to real atom changes, keeping the flow predictable.
* **4.3 References and DOM-Ready:** useRef is a reactive bridge. whenReady ensures logic runs only after the node is stable in the hierarchy.
* **4.4 Directives:** Show and ForEach orchestrate structure at the real DOM level, deciding how to attach or move elements.
* **4.5 Render Without Diffing:** Bunnix.render and Bunnix.toDOM turn reactive intent into real DOM presence without fighting external DOM changes.

## **5. Integration**

Bunnix is strongest when these pillars work together: nested atoms inside a ForEach, observed by a useEffect that updates useRef targets.

### **5.1 Complex Integration Example**

Injecting real components via `Bunnix.toDOM` into audit logs and using **Reactive CSS Props**.

```js
import Bunnix, { useState, useEffect, useRef, ForEach } from '@bunnix/core';
const { div, input, button, ul, li, span, b } = Bunnix;

// Atomic Log Entry
const LogEntry = ({ userId, userName, active }) => (
    div({ class: 'log-item' }, [
        span({ style: 'color: #888; font-size: 0.8em;' }, `[${new Date().toLocaleTimeString()}] `),
        b(`ID:${userId} `),
        span(`${userName} is `),
        span({
            style: {
                color: active ? 'green' : 'red',
                fontWeight: 'bold'
            }
        }, active ? 'ONLINE' : 'OFFLINE')
    ])
);

const UserManager = () => {
    const users = useState([
        { id: 1, name: useState('Admin'), active: useState(true) }
    ]);
    const logRef = useRef();

    useEffect(() => {
        let activeSubscriptions = [];

        const syncLogs = () => {
            activeSubscriptions.forEach((unsub) => unsub());
            activeSubscriptions = users.get().map((user) =>
                user.active.subscribe((v) => {
                    const entry = Bunnix.toDOM(LogEntry({
                        userId: user.id,
                        userName: user.name.get(),
                        active: v
                    }));
                    logRef.current?.appendChild(entry);
                    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
                })
            );
        };

        const unsubList = users.subscribe(syncLogs);
        syncLogs();

        return () => {
            unsubList();
            activeSubscriptions.forEach((u) => u());
        };
    }, []);

    return div({ class: 'manager-panel' }, [
        div({ ref: logRef, class: 'audit-log', style: 'height: 120px; overflow-y: auto;' }),
        ul([
            ForEach(users, 'id', (user) =>
                li({
                    style: { opacity: user.active.map((v) => (v ? 1 : 0.5)) }
                }, [
                    input({ value: user.name, input: (e) => user.name.set(e.target.value) }),
                    button({ click: () => user.active.set(!user.active.get()) },
                        user.active.map((v) => (v ? 'Deactivate' : 'Activate'))
                    )
                ])
            )
        ])
    ]);
};
```

## **6. Use Cases**

Bunnix shines when raw efficiency is mandatory:

* **High-Frequency Dashboards:** Real-time visualizations without UI degradation.
* **Mobile Apps and PWAs:** Near-native fluidity with minimal RAM in WebViews.
* **IoT and Embedded Systems:** Control interfaces on constrained hardware.
* **Lean Web Solutions:** Micro-frontends aiming for maximum performance with reduced payload.

## **7. React Developers: Feel at Home**

### **7.1 useState**

* **Bunnix:** Returns an atom that supports map and direct subscriptions via .subscribe.

```js
const count = useState(0);
count.subscribe((v) => console.log('Changed to:', v));
count.set(count.get() + 1);
```

### **7.2 useEffect**

* **Bunnix:** Hybrid. Accepts a single atom with unwrapped value, or an array of dependencies.

```js
// Unwrapped mode (single state)
useEffect((val) => { console.log(val); }, count);
// Array mode (React style)
useEffect(() => { console.log(count.get()); }, [count]);
```

### **7.3 useMemo**

* **Bunnix:** A live derived state (a new bound atom).

```js
const double = useMemo([count], (c) => c * 2);
```

### **7.4 useRef**

* **Bunnix:** Returns a stable `{ current }` object for imperative access.

```js
const inputRef = useRef();
```

## **8. Maintainability**

With **zero runtime dependencies**, Bunnix isolates the project from third-party vulnerabilities. The code is compact, auditable, and depends only on standard web APIs, ensuring stability for years.

## **9. Comparison Table**

| Feature | React | SolidJS | Vue | Bunnix |
| :---- | :---- | :---- | :---- | :---- |
| **Architecture** | Persistent VDOM | Signals/Compilation | Proxy/VDOM | **Atomic Binding / Ephemeral VDOM** |
| **Updates** | Component-level | Fine-grained | Component-level | **Atomic-level** |
| **Dependencies** | High | Low | Medium | **Zero (runtime)** |
| **Memory** | High | Low | Medium | **Minimal** |
| **Attributes** | Synthetic | Native | Directives | **Native (Direct)** |

## **10. Current Status**

Bunnix is currently available for direct use as an `npmjs` package and is in Release Candidate Preview `v0.9.0`, stable, tested, and technically documented for the recommended web projects, with a planned release in Q1 2026.

```bash
npm install @bunnix/core
```

**And there is more**: Bunnix is making the vision of a modular suite for web applications real, also providing complementary packages for most project needs:

| Package | Purpose | Status | Timeline | Repository |
| --- | --- | --- | --- | --- |
| **Bunnix Router** (`@bunnix/router`) | Decentralized, context-aware routing framework for Bunnix. | Release Candidate Preview `v0.9.0` | Q1 2026 | [bunnix-router](https://github.com/bunnix-js/bunnix-router) |
| **Bunnix Redux** (`@bunnix/redux`) | Global state management framework built for Bunnix. | Internal development | Q1 2026 | [bunnix-redux](https://github.com/bunnix-js/bunnix-redux) |
| **Bunnix Optimistics** (`@bunnix/optimistics`) | Optimistic state control while external data loads, built for Bunnix. | Internal development | Q1 2026 | [bunnix-optmistics](https://github.com/bunnix-js/bunnix-optmistics) |

## **11. Conclusion**

Bunnix returns control to the developer and performance to the end user. It is ideal for teams that want raw efficiency, security, and a strong technical foundation.

**Explore the code and contribute:** https://github.com/bunnix-js/bunnix
