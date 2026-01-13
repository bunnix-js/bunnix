import Swiftx, {
    useState,
    useEffect,
    useMemo,
    useRef,
    whenReady,
    render,
    Show,
    ForEach,
    Compute
} from './src/swiftx/index.mjs';
import SwiftxRouter, {
    BrowserRouter,
    RouterRoot,
    RouteGroup,
    RoutePolicy,
    Route,
    Link,
    useRouterContext
} from './src/swiftx-router/index.mjs';

Swiftx.Router = SwiftxRouter;

export default Swiftx;
export {
    Swiftx,
    SwiftxRouter,
    BrowserRouter,
    RouterRoot,
    RouteGroup,
    RoutePolicy,
    Route,
    Link,
    useRouterContext,
    useState,
    useEffect,
    useMemo,
    useRef,
    whenReady,
    render,
    Show,
    ForEach,
    Compute
};
