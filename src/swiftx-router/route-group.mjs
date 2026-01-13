const isPolicyLike = (value) => (
    typeof value === 'function'
    || (value && typeof value === 'object' && value.type === 'RoutePolicy')
);

const normalizeGroupArgs = (rootPath, routesOrComponent, policiesOrLayout, maybeLayout, isRoot) => {
    const isRouteArray = Array.isArray(routesOrComponent);
    const policiesOnly = isRouteArray && routesOrComponent.length > 0
        && routesOrComponent.every(isPolicyLike);
    const routes = isRouteArray && !policiesOnly ? routesOrComponent : [];
    const component = !isRouteArray && routesOrComponent ? routesOrComponent : null;

    const policies = isRouteArray && policiesOnly
        ? routesOrComponent
        : Array.isArray(policiesOrLayout) ? policiesOrLayout : [];
    const layout = isRouteArray && policiesOnly
        ? (policiesOrLayout ?? null)
        : Array.isArray(policiesOrLayout)
            ? (maybeLayout ?? null)
            : (policiesOrLayout ?? null);

    return {
        type: 'RouteGroup',
        rootPath,
        routes,
        policies,
        layout,
        component,
        isRoot
    };
};

export const RouteGroup = (rootPath, routesOrComponent, policiesOrLayout = [], layout = null) => (
    normalizeGroupArgs(rootPath, routesOrComponent, policiesOrLayout, layout, false)
);

RouteGroup.root = (routesOrComponent, policiesOrLayout = [], layout = null) => (
    normalizeGroupArgs('/', routesOrComponent, policiesOrLayout, layout, true)
);
