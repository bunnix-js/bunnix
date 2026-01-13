---
layout: default
title: Router Overview
---

# Router Overview

Swiftx Router is decentralized and context-aware. Routes are defined with a fluent API, and navigation is scoped to the current stack.

## Router Pieces

- `BrowserRouter`: wraps your app and enables routing.
- `RouterRoot`: defines the root router tree (new API).
- `RouteGroup`: groups routes with shared policies and layouts (new API).
- `RoutePolicy`: guard/redirect logic for groups (new API).
- `Route`: route definition helper (`Route('/path', Component)`).
- `RouterStack`: legacy stack API (still supported).
- `Link`: declarative navigation.

## Read Next

- [Routes](./router-routes.md)
- [Layouts](./router-layouts.md)
- [Navigation](./router-navigation.md)
- [Migration Guide](./router-migration.md)
