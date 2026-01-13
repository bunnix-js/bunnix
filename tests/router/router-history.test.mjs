import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterRoot, RouteGroup, Route } from '../../index.mjs';

test('navigation.back navigates within the current group history', async () => {
    window.history.replaceState({}, '', '/group-one');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    let navigation;

    const Home = ({ navigation: nav }) => {
        navigation = nav;
        return Swiftx('div', {}, 'Home');
    };
    const Details = () => Swiftx('div', {}, 'Details');

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            RouteGroup('/group-one', [
                Route('/group-one', Home),
                Route('/group-one/details', Details)
            ])
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    navigation.push('/group-one/details');
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Details');

    navigation.back();
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Home');
});

test('navigation.back falls back to group root when history is empty', async () => {
    window.history.replaceState({}, '', '/group-two/details');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');

    const GroupRoot = () => Swiftx('div', {}, 'GroupRoot');
    const Details = ({ navigation }) => {
        Swiftx.useEffect(() => {
            navigation.back();
        }, []);
        return Swiftx('div', {}, 'Details');
    };

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            RouteGroup('/group-two', [
                Route('/group-two', GroupRoot),
                Route('/group-two/details', Details)
            ])
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'GroupRoot');
});

test('navigation.back uses explicit fallback when provided', async () => {
    window.history.replaceState({}, '', '/group-three/details');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');

    const Fallback = () => Swiftx('div', {}, 'Fallback');
    const Details = ({ navigation }) => {
        Swiftx.useEffect(() => {
            navigation.back('/fallback');
        }, []);
        return Swiftx('div', {}, 'Details');
    };

    const App = () => RouterRoot(
        Route.root(() => Swiftx('div', {}, 'Root')),
        [
            Route('/fallback', Fallback),
            RouteGroup('/group-three', [
                Route('/group-three/details', Details)
            ])
        ]
    );

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent, 'Fallback');
});
