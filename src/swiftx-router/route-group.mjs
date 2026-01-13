const normalizeGroupArgs = (rootPath, routesOrComponent, policiesOrLayout, maybeLayout, isRoot) => {
    const isRouteArray = Array.isArray(routesOrComponent);
    const routes = isRouteArray ? routesOrComponent : [];
    const component = !isRouteArray && routesOrComponent ? routesOrComponent : null;

    const policies = Array.isArray(policiesOrLayout) ? policiesOrLayout : [];
    const layout = Array.isArray(policiesOrLayout)
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
