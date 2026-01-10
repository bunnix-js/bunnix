import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterStack, Route, Link } from '../../index.mjs';
import { resetRouterCount } from '../../src/swiftx-router/browser-router.mjs';


test('Route builder creates a rule with render', () => {
    const rule = Route.on('/').render(() => 'ok');
    assert.equal(rule.condition, '/');
    assert.equal(typeof rule.render, 'function');
});

test('Route notFound can be defined', () => {
    const rule = Route.notFound.render(() => 'nf');
    assert.equal(rule.condition, Route._NOT_FOUND);
    assert.equal(typeof rule.render, 'function');
});

test('RouterStack renders the matched route', () => {
    const container = document.createElement('div');
    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/').render(() => Swiftx('div', {}, 'Home')),
            Route.notFound.render(() => Swiftx('div', {}, 'NF'))
        ]
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'Home');
});

test('RouterStack layout renders once across route changes', () => {
    window.history.replaceState({}, '', '/');
    const container = document.createElement('div');

    let layoutRenderCount = 0;
    const layoutToken = `layout-${Math.random()}`;

    const Layout = ({ routerOutlet }) => {
        layoutRenderCount += 1;
        return Swiftx('div', { id: 'layout' }, [
            Swiftx('span', { id: 'layout-token' }, layoutToken),
            Swiftx('main', [routerOutlet()])
        ]);
    };

    let navigation;
    const Home = ({ navigation: nav }) => {
        navigation = nav;
        return Swiftx('div', {}, 'Home');
    };
    const About = () => Swiftx('div', {}, 'About');

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/').render(Home),
            Route.on('/about').render(About)
        ],
        layout: Layout
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    const tokenBefore = container.querySelector('#layout-token')?.textContent;
    assert.ok(navigation);
    assert.equal(container.textContent.includes('Home'), true);
    assert.equal(layoutRenderCount, 1);
    assert.equal(tokenBefore, layoutToken);

    navigation.push('/about');

    const tokenAfter = container.querySelector('#layout-token')?.textContent;
    assert.equal(container.textContent.includes('About'), true);
    assert.equal(layoutRenderCount, 1);
    assert.equal(tokenAfter, layoutToken);
});

test('Route state updates continue after navigation without errors', async () => {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    const container = document.createElement('div');

    let navigation;
    const intervalIds = [];
    window.__testTickCount = 0;

    const RouteOne = ({ navigation: nav }) => {
        navigation = nav;
        Swiftx.useEffect(() => {
            const id = setInterval(() => {
                window.__testTickCount += 1;
            }, 10);
            intervalIds.push(id);
            return () => intervalIds.forEach((value) => clearInterval(value));
        }, []);
        return Swiftx('div', { id: 'route-one' }, 'Route 1');
    };

    const RouteTwo = () => Swiftx('div', { id: 'route-two' }, 'Route 2');

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/').render(RouteOne),
            Route.on('/2').render(RouteTwo)
        ]
    });

    let caughtError;
    const errorHandler = (err) => { caughtError = err; };
    const rejectionHandler = (err) => { caughtError = err; };
    process.once('uncaughtException', errorHandler);
    process.once('unhandledRejection', rejectionHandler);

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(container.textContent.includes('Route 1'), true);
    assert.ok(navigation);

    navigation.push('/2');

    await new Promise((resolve) => setTimeout(resolve, 35));
    const firstTickCount = window.__testTickCount;
    await new Promise((resolve) => setTimeout(resolve, 35));
    const secondTickCount = window.__testTickCount;
    intervalIds.forEach((value) => clearInterval(value));
    process.removeListener('uncaughtException', errorHandler);
    process.removeListener('unhandledRejection', rejectionHandler);

    if (caughtError) throw caughtError;
    assert.equal(container.textContent.includes('Route 2'), true);
    assert.equal(container.querySelector('#route-one'), null);
    assert.ok(secondTickCount > firstTickCount);
});

test('RouterStack does not keep expenses list when linking to expense details', async () => {
    window.history.replaceState({}, '', '/expenses/10');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');

    const ExpensesByAccount = ({ navigation }) => {
        return Swiftx('div', { id: 'expense-list' }, [
            Swiftx(Link, { to: '/expense/10/99', navigation }, 'Go to expense')
        ]);
    };
    const ExpenseDetails = () => Swiftx('div', { id: 'expense-detail' }, 'Expense Details');

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/expenses/:accountId').render(ExpensesByAccount),
            Route.on('/expense/:accountId/:expenseId').render(ExpenseDetails),
            Route.notFound.render(() => Swiftx('div', {}, 'NF'))
        ]
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.querySelector('#expense-list')?.textContent, 'Go to expense');
    assert.equal(container.querySelector('#expense-detail'), null);

    const link = container.querySelector('a');
    assert.ok(link);
    link.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(container.querySelector('#expense-detail')?.textContent, 'Expense Details');
    assert.equal(container.querySelector('#expense-list'), null);
});


test('RouterStack layout renders only the matched expense route', async () => {
    window.history.replaceState({}, '', '/expenses/10');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');

    const Layout = ({ routerOutlet }) => (
        Swiftx('section', { id: 'layout' }, [
            Swiftx('header', {}, 'Header'),
            routerOutlet()
        ])
    );

    const ExpensesByAccount = ({ navigation }) => (
        Swiftx('div', { id: 'expense-list' }, [
            Swiftx(Link, { to: '/expense/10/99', navigation }, 'Go to expense')
        ])
    );
    const ExpenseDetails = () => Swiftx('div', { id: 'expense-detail' }, 'Expense Details');

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/expenses/:accountId').render(ExpensesByAccount),
            Route.on('/expense/:accountId/:expenseId').render(ExpenseDetails),
            Route.notFound.render(() => Swiftx('div', {}, 'NF'))
        ],
        layout: Layout
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.querySelector('#layout')?.textContent.includes('Header'), true);
    assert.equal(container.querySelector('#expense-list')?.textContent, 'Go to expense');
    assert.equal(container.querySelector('#expense-detail'), null);

    const link = container.querySelector('a');
    assert.ok(link);
    link.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(container.querySelector('#expense-detail')?.textContent, 'Expense Details');
    assert.equal(container.querySelector('#expense-list'), null);
});

test('RouterStack layout handles ForEach list navigation to expense details', async () => {
    window.history.replaceState({}, '', '/expenses/10');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');

    const Layout = ({ routerOutlet }) => (
        Swiftx('section', { id: 'layout' }, [
            Swiftx('header', {}, 'Header'),
            routerOutlet()
        ])
    );

    const ExpensesByAccount = ({ navigation }) => {
        const items = Swiftx.useState([
            { id: '1', label: 'First' },
            { id: '2', label: 'Second' }
        ]);
        return Swiftx('ul', { id: 'expense-list' }, [
            Swiftx.ForEach(items, 'id', (expense) => (
                Swiftx('li', {}, [
                    Swiftx(Link, { to: `/expense/10/${expense.id}`, navigation }, expense.label)
                ])
            ))
        ]);
    };

    const ExpenseDetails = ({ expenseId }) => (
        Swiftx('div', { id: 'expense-detail' }, `Expense ${expenseId}`)
    );

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/expenses/:accountId').render(ExpensesByAccount),
            Route.on('/expense/:accountId/:expenseId').render(ExpenseDetails),
            Route.notFound.render(() => Swiftx('div', {}, 'NF'))
        ],
        layout: Layout
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => queueMicrotask(resolve));

    const links = Array.from(container.querySelectorAll('#expense-list a'));
    assert.equal(links.length, 2);
    assert.equal(container.querySelector('#expense-detail'), null);

    links[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(container.querySelector('#expense-detail')?.textContent, 'Expense 2');
    assert.equal(container.querySelector('#expense-list'), null);
});

test('RouterStack passes route params to layout components', () => {
    window.history.replaceState({}, '', '/user/42');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    let seenId;

    const Layout = ({ routerOutlet, id }) => {
        seenId = id;
        return Swiftx('div', { id: 'layout' }, [
            Swiftx('span', { id: 'layout-id' }, id || 'none'),
            routerOutlet()
        ]);
    };

    const User = ({ id }) => Swiftx('div', { id: 'user' }, `User ${id}`);

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/user/:id').render(User)
        ],
        layout: Layout
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(seenId, '42');
    assert.equal(container.querySelector('#layout-id')?.textContent, '42');
    assert.equal(container.querySelector('#user')?.textContent, 'User 42');
});

test('RouterStack weak control uses push to /home', async () => {
    window.history.replaceState({}, '', '/account/42');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    container.id = 'weak-control-push-root';
    let active = true;

    const Home = () => Swiftx('div', { id: 'home' }, 'Home');
    const Account = ({ navigation }) => {
        Swiftx.useEffect(() => {
            if (active) navigation.push('/home');
        }, []);
        return Swiftx('div', { id: 'account' }, 'Account');
    };

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/home').render(Home),
            Route.on('/account/:id').render(Account)
        ]
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
        assert.equal(container.querySelector('#home')?.textContent, 'Home');
        assert.equal(container.querySelector('#account'), null);
    } finally {
        active = false;
    }
});

test('RouterStack weak control uses replace to /home', async () => {
    window.history.replaceState({}, '', '/account/42');
    window.dispatchEvent(new window.PopStateEvent('popstate'));

    const container = document.createElement('div');
    container.id = 'weak-control-replace-root';
    let active = true;

    const Home = () => Swiftx('div', { id: 'home' }, 'Home');
    const Account = ({ navigation }) => {
        Swiftx.useEffect(() => {
            if (active) navigation.replace('/home');
        }, []);
        return Swiftx('div', { id: 'account' }, 'Account');
    };

    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/home').render(Home),
            Route.on('/account/:id').render(Account)
        ]
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
        assert.equal(container.querySelector('#home')?.textContent, 'Home');
        assert.equal(container.querySelector('#account'), null);
    } finally {
        active = false;
    }
});
