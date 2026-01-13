import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterRoot, RouteGroup, RoutePolicy, Route } from '../../index.mjs';

test('Group policies can redirect based on context', async () => {
    window.history.replaceState({}, '', '/home');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const Login = () => Swiftx('div', {}, 'Login');

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            Route('/login', Login),
            RouteGroup('/home', [
                Route('/home', Home)
            ], [
                RoutePolicy(({ context, navigation }) => {
                    if (!context.user) navigation.replace('/login');
                })
            ])
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Login');
});

test('Group policies can redirect to forbidden routes', async () => {
    window.history.replaceState({}, '', '/admin');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Admin = () => Swiftx('div', {}, 'Admin');
    const Forbidden = () => Swiftx('div', {}, 'Forbidden');

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            RouteGroup('/admin', [
                Route('/admin', Admin)
            ], [
                RoutePolicy(({ navigation }) => {
                    navigation.replace(Route.forbidden);
                })
            ]),
            Route.forbidden(Forbidden)
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Forbidden');
});

test('Groups render their own layouts and expose navigation state', async () => {
    window.history.replaceState({}, '', '/group-one/42');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    let navigation;

    const LayoutOne = ({ routerOutlet }) => (
        Swiftx('section', { id: 'layout-one' }, ['One-', routerOutlet()])
    );
    const LayoutTwo = ({ routerOutlet }) => (
        Swiftx('section', { id: 'layout-two' }, ['Two-', routerOutlet()])
    );

    const GroupOne = ({ navigation: nav }) => {
        navigation = nav;
        return Swiftx('div', {}, `${nav.path}-${nav.params.id}-${nav.group.rootPath}`);
    };
    const GroupTwo = () => Swiftx('div', {}, 'GroupTwo');

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            RouteGroup('/group-one', [
                Route('/group-one/:id', GroupOne)
            ], [], LayoutOne),
            RouteGroup('/group-two', [
                Route('/group-two', GroupTwo)
            ], [], LayoutTwo)
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'One-/group-one/42-42-/group-one');
    assert.ok(container.querySelector('#layout-one'));

    navigation.push('/group-two');
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(container.textContent, 'Two-GroupTwo');
    assert.ok(container.querySelector('#layout-two'));
});
