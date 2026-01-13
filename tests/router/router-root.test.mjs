import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterRoot, RouteGroup, RoutePolicy, Route } from '../../index.mjs';

test('RouterRoot renders a root route', () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const App = () => RouterRoot(Route.root(Home));

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'Home');
});

test('RouterRoot matches extra routes', () => {
    window.history.replaceState({}, '', '/about');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const About = () => Swiftx('div', {}, 'About');
    const App = () => RouterRoot(Route.root(Home), [
        Route('/about', About)
    ]);

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'About');
});

test('RouterRoot accepts RouteGroup root with policies', () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Home = () => Swiftx('div', {}, 'Home');
    const App = () => RouterRoot(
        RouteGroup.root(Home, [
            RoutePolicy(() => {})
        ])
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'Home');
});

test('RouterRoot navigates to Route.notFound', async () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const NotFound = () => Swiftx('div', {}, 'NF');
    const Guard = ({ navigation }) => {
        Swiftx.useEffect(() => {
            navigation.replace(Route.notFound);
        }, []);
        return Swiftx('div', {}, 'Guard');
    };

    const App = () => RouterRoot(
        Route.root(Guard),
        [Route.notFound(NotFound)]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'NF');
});

test('RouterRoot navigates to Route.forbidden', async () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    const Forbidden = () => Swiftx('div', {}, 'Forbidden');
    const App = () => RouterRoot(
        RouteGroup.root(
            () => Swiftx('div', {}, 'Root'),
            [
                RoutePolicy(({ navigation }) => {
                    navigation.replace(Route.forbidden);
                })
            ]
        ),
        [Route.forbidden(Forbidden)]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Forbidden');
});
