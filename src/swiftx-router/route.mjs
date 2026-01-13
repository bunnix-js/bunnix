/**
 * Internal helper to create a fluent rule builder for a given route condition.
 * 
 * @param {string} condition - The path pattern or NOT_FOUND constant to match.
 * @returns {Object} A builder object with terminal actions.
 */
const createBuilder = (condition) => ({
    /**
     * Terminally render a component or VDOM element for this route.
     * 
     * @param {Function|DOMNode} content - The component or element to render.
     * @returns {Object} A route rule definition.
     */
    render: (content) => ({
        condition,
        render: content
    }),

    /**
     * Terminally execute a side-effect callback for this route.
     * Useful for redirects or logging.
     * 
     * @param {Function} callback - A function receiving (navigation, params).
     * @returns {Object} A route rule definition.
     */
    then: (callback) => ({
        condition,
        then: callback
    })
});

/**
 * Unified Route API supporting both the legacy fluent builder and the new RouterRoot syntax.
 */
export const Route = (path, component = null) => ({
    type: 'Route',
    kind: 'normal',
    path,
    component
});

Route._NOT_FOUND = '__swiftx_not_found__';
Route._FORBIDDEN = '__swiftx_forbidden__';

Route.root = (component = null) => Route('/', component);

Route.on = (path) => createBuilder(path);

const notFoundRoute = (component) => ({
    type: 'Route',
    kind: 'notFound',
    path: Route._NOT_FOUND,
    component
});
notFoundRoute.path = Route._NOT_FOUND;
notFoundRoute.render = (content) => ({
    condition: Route._NOT_FOUND,
    render: content
});
notFoundRoute.then = (callback) => ({
    condition: Route._NOT_FOUND,
    then: callback
});
Route.notFound = notFoundRoute;

const forbiddenRoute = (component) => ({
    type: 'Route',
    kind: 'forbidden',
    path: Route._FORBIDDEN,
    component
});
forbiddenRoute.path = Route._FORBIDDEN;
forbiddenRoute.render = (content) => ({
    condition: Route._FORBIDDEN,
    render: content
});
forbiddenRoute.then = (callback) => ({
    condition: Route._FORBIDDEN,
    then: callback
});
Route.forbidden = forbiddenRoute;
