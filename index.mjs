import Bunnix, {
    useState,
    useEffect,
    useMemo,
    useRef,
    whenReady,
    render,
    Show,
    ForEach,
    Compute
} from './src/bunnix/index.mjs';
import BunnixRouter, {
    BrowserRouter,
    RouterRoot,
    RouteGroup,
    RoutePolicy,
    Route,
    Link,
    useRouterContext
} from './src/bunnix-router/index.mjs';

Bunnix.Router = BunnixRouter;

export default Bunnix;
export {
    Bunnix,
    BunnixRouter,
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
