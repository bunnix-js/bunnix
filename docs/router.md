---
layout: default
title: Router Overview
---

# Router Overview

Swiftx Router is decentralized and context-aware. Routes are defined with a fluent API, and navigation is scoped to the current stack.

## Router Pieces

- `BrowserRouter`: wraps your app and enables routing.
- `RouterStack`: defines a stack with a root path, routes, and optional layout.
- `Route`: fluent rule builder with `.on()` and `.notFound`.
- `Link`: declarative navigation.

## Read Next

- [Routes](./router-routes.md)
- [Layouts](./router-layouts.md)
- [Navigation](./router-navigation.md)
