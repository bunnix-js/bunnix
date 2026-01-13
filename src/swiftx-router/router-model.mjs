import { Route } from './route.mjs';

/**
 * Internal model builders for the upcoming router system.
 * These are intentionally not exported as part of the public API yet.
 */

export const createRoutePolicyModel = (handler) => ({
    type: 'RoutePolicy',
    handler
});

export const createRouteGroupModel = ({ rootPath, routes, policies, layout, isRoot = false }) => ({
    type: 'RouteGroup',
    rootPath,
    routes,
    policies,
    layout,
    isRoot
});

export const createRouterRootModel = ({ rootPath, rules, layout }) => {
    const routes = rules.map((rule) => ({
        type: 'Route',
        condition: rule.condition,
        render: rule.render,
        then: rule.then
    }));

    return {
        type: 'RouterRoot',
        rootPath,
        rootGroup: createRouteGroupModel({
            rootPath,
            routes,
            policies: [],
            layout,
            isRoot: true
        }),
        groups: []
    };
};

/**
 * Internal utility to match a path against a pattern (e.g., /user/:id).
 *
 * @param {string} pattern - The route pattern to match against.
 * @param {string} path - The actual URL path.
 * @returns {Object} An object containing:
 *   - matches {boolean}: Whether the path matches the pattern.
 *   - params {Object}: Extracted dynamic parameters from colon-prefixed segments.
 */
const matchPath = (pattern, path) => {
    if (pattern === Route._NOT_FOUND) return { matches: false, params: {} };

    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
        return { matches: false, params: {} };
    }

    const params = {};
    const matches = patternSegments.every((seg, i) => {
        if (seg.startsWith(':')) {
            const paramName = seg.slice(1);
            params[paramName] = pathSegments[i];
            return true;
        }
        return seg === pathSegments[i];
    });

    return { matches, params };
};

export const matchRouteGroup = (groupModel, path) => {
    let activeRoute = null;
    let params = {};

    for (const route of groupModel.routes) {
        const result = matchPath(route.condition, path);
        if (result.matches) {
            activeRoute = route;
            params = result.params;
            break;
        }
    }

    if (!activeRoute) {
        activeRoute = groupModel.routes.find((route) => route.condition === Route._NOT_FOUND) ?? null;
    }

    return { route: activeRoute, params };
};
