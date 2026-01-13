import { RouterRoot } from './router-root.mjs';
import { RouteGroup } from './route-group.mjs';
import { Route } from './route.mjs';

/**
 * RouterStack Component (legacy wrapper).
 *
 * @param {import('./index.d.ts').RouterStackProps|string} propsOrRoot - Props object or rootPath.
 * @param {Array} [rulesArg=[]] - Route rules when using positional args.
 * @param {Function|null} [layoutArg=null] - Layout component when using positional args.
 */
export const RouterStack = (propsOrRoot, rulesArg = [], layoutArg = null) => {
    const isPropsObject = typeof propsOrRoot === 'object' && propsOrRoot !== null && !Array.isArray(propsOrRoot);
    const rootPath = isPropsObject ? propsOrRoot.rootPath : propsOrRoot;
    const rules = isPropsObject ? (propsOrRoot.rules || []) : rulesArg;
    const layout = isPropsObject ? (propsOrRoot.layout || null) : layoutArg;
    const policies = isPropsObject ? (propsOrRoot.policies || []) : [];
    const context = isPropsObject ? (propsOrRoot.context || null) : null;

    const routes = rules.map((rule) => {
        const kind = rule.condition === Route._NOT_FOUND
            ? 'notFound'
            : rule.condition === Route._FORBIDDEN
                ? 'forbidden'
                : 'normal';

        const route = {
            type: 'Route',
            kind,
            path: rule.condition,
            component: rule.render ?? null,
            render: rule.render ?? null,
            then: rule.then
        };

        return route;
    });

    const rootGroup = RouteGroup(rootPath, routes, policies, layout);
    const routerContext = context ? { ...context } : {};
    routerContext.__routerOptions = { historyMode: 'global' };

    return RouterRoot(routerContext, rootGroup);
};
