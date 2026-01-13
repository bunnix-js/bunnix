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
    RouterStack,
    RouterRoot,
    RouteGroup,
    RoutePolicy,
    Route,
    Link
} from './src/swiftx-router/index.mjs';

Swiftx.Router = SwiftxRouter;

export default Swiftx;
export {
    Swiftx,
    SwiftxRouter,
    BrowserRouter,
    RouterStack,
    RouterRoot,
    RouteGroup,
    RoutePolicy,
    Route,
    Link,
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
