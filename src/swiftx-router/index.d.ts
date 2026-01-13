/**
 * Navigation object injected into components and layouts.
 */
export interface Navigation {
    /** Navigates to a new path. */
    push(path: string | RouteDefinition | RouteSpecialBuilder): void;
    /** Replaces current history entry. */
    replace(path: string | RouteDefinition | RouteSpecialBuilder): void;
    /** Navigates back or to fallback. */
    back(fallback?: string | RouteDefinition | RouteSpecialBuilder): void;
    /** Current resolved path. */
    path: string;
    /** Current route params. */
    params: Record<string, string>;
    /** Group navigation info. */
    group: {
        rootPath: string;
    };
    /** Reactive state containing the current path string. */
    currentPath: any;
    /** The base path of the current navigation stack. */
    rootPath: string;
}

/**
 * Route rule builder.
 */
export interface RouteBuilder {
    render(component: any): any;
    then(callback: (navigation: Navigation, params: Record<string, string>) => void): any;
}

/**
 * Fluent API for defining routes.
 */
export interface RouteDefinition {
    type: 'Route';
    kind: 'normal' | 'notFound' | 'forbidden';
    path: string;
    component?: any;
}

export interface RouteSpecialBuilder {
    (component: any): RouteDefinition;
    render(component: any): any;
    then(callback: (navigation: Navigation, params: Record<string, string>) => void): any;
    path: string;
}

export const Route: {
    (path: string, component?: any): RouteDefinition;
    root(component?: any): RouteDefinition;
    /** Define a rule for a specific path (e.g., '/', '/user/:id'). */
    on(path: string): RouteBuilder;
    /** Define a fallback rule. */
    notFound: RouteSpecialBuilder;
    /** Define a forbidden rule. */
    forbidden: RouteSpecialBuilder;
    _NOT_FOUND: string;
    _FORBIDDEN: string;
};

export interface RoutePolicyDefinition {
    type: 'RoutePolicy';
    handler: (params: { context: any; navigation: Navigation }) => void;
}

export interface RouteGroupDefinition {
    type: 'RouteGroup';
    rootPath: string;
    routes: RouteDefinition[];
    policies: RoutePolicyDefinition[];
    layout?: (props: { routerOutlet: () => any, navigation: Navigation }) => any;
    component?: any;
    isRoot?: boolean;
}

/**
 * Props for the RouterStack component.
 */
export interface RouterStackProps {
    rootPath: string;
    rules: any[];
    layout?: (props: { routerOutlet: () => any, navigation: Navigation }) => any;
}

export function RouterStack(props: RouterStackProps): any;
export function RouterStack(
    rootPath: string,
    rules: any[],
    layout?: (props: { routerOutlet: () => any, navigation: Navigation }) => any
): any;
export function BrowserRouter(child: any): any;
export function RouterRoot(root: RouteDefinition | RouteGroupDefinition, routes?: Array<RouteDefinition | RouteGroupDefinition>): any;
export function RouterRoot(context: any, root: RouteDefinition | RouteGroupDefinition, routes?: Array<RouteDefinition | RouteGroupDefinition>): any;
export namespace RouterRoot {
    function Context(appContext?: any): any;
}
export function RouteGroup(
    rootPath: string,
    routesOrComponent: RouteDefinition[] | any,
    policiesOrLayout?: RoutePolicyDefinition[] | ((props: any) => any),
    layout?: (props: any) => any
): RouteGroupDefinition;
export namespace RouteGroup {
    function root(
        routesOrComponent: RouteDefinition[] | any,
        policiesOrLayout?: RoutePolicyDefinition[] | ((props: any) => any),
        layout?: (props: any) => any
    ): RouteGroupDefinition;
}
export function RoutePolicy(handler: (params: { context: any; navigation: Navigation }) => void): RoutePolicyDefinition;

export interface LinkProps {
    to: string;
    navigation?: Navigation;
    [key: string]: any;
}

export function Link(props: LinkProps, children: any): any;

export const SwiftxRouter: {
    BrowserRouter: typeof BrowserRouter;
    RouterStack: typeof RouterStack;
    RouterRoot: typeof RouterRoot;
    RouteGroup: typeof RouteGroup;
    RoutePolicy: typeof RoutePolicy;
    Route: typeof Route;
    Link: typeof Link;
};

export default SwiftxRouter;
