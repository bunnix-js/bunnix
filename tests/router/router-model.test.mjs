import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Route } from '../../src/swiftx-router/route.mjs';
import { createRouterRootModel, matchRouteGroup } from '../../src/swiftx-router/router-model.mjs';

test('Router model matches parameterized routes', () => {
    const model = createRouterRootModel({
        rootPath: '/',
        rules: [
            Route.on('/user/:id').render(() => 'ok'),
            Route.notFound.render(() => 'nf')
        ],
        layout: null
    });

    const result = matchRouteGroup(model.rootGroup, '/user/42');
    assert.equal(result.route.condition, '/user/:id');
    assert.equal(result.params.id, '42');
});

test('Router model falls back to notFound when no route matches', () => {
    const model = createRouterRootModel({
        rootPath: '/',
        rules: [
            Route.on('/home').render(() => 'ok'),
            Route.notFound.render(() => 'nf')
        ],
        layout: null
    });

    const result = matchRouteGroup(model.rootGroup, '/missing');
    assert.equal(result.route.condition, Route._NOT_FOUND);
});
