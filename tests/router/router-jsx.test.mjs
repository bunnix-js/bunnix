import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterRoot, RouteGroup, RoutePolicy, Route } from '../../index.mjs';

test('RouterRoot JSX renders root group and extra routes', () => {
    window.history.replaceState({}, '', '/about');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const About = () => Swiftx('div', {}, 'About');

    const App = () => Swiftx(RouterRoot, {}, [
        Swiftx(RouteGroup, { root: true }, [
            Swiftx(Route, { path: '/', component: Home })
        ]),
        Swiftx(Route, { path: '/about', component: About })
    ]);

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'About');
});

test('RoutePolicy JSX redirects before rendering', async () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const About = () => Swiftx('div', {}, 'About');

    const App = () => Swiftx(RouterRoot, {}, [
        Swiftx(RouteGroup, { root: true }, [
            Swiftx(Route, { path: '/', component: Home }),
            Swiftx(Route, { path: '/about', component: About }),
            Swiftx(RoutePolicy, {
                handler: ({ navigation }) => {
                    if (navigation.path === '/') {
                        navigation.replace('/about');
                    }
                }
            })
        ])
    ]);

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'About');
});

test('RouteGroup JSX supports component prop and policies prop', async () => {
    window.history.replaceState({}, '', '/account');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Account = () => Swiftx('div', {}, 'Account');
    const calls = [];

    const App = () => Swiftx(RouterRoot, {}, [
        Swiftx(RouteGroup, { root: true }, [
            Swiftx(Route, { path: '/', component: () => Swiftx('div', {}, 'Root') })
        ]),
        Swiftx(RouteGroup, {
            rootPath: '/account',
            component: Account,
            policies: [() => calls.push('policy')]
        })
    ]);

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Account');
    assert.equal(calls.length, 1);
});
