import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { render } from '../../index.mjs';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>');
global.document = dom.window.document;
global.Node = dom.window.Node;

test('Functional components receive children in props (React-style)', () => {
    const container = document.getElementById('root');
    container.innerHTML = '';

    function MyContainer({ children }) {
        return Bunnix('div', { id: 'container' }, children);
    }

    const App = Bunnix(MyContainer, {}, [
        Bunnix('h1', {}, 'Hello')
    ]);

    render(App, container);

    const div = container.querySelector('#container');
    const h1 = div?.querySelector('h1');
    
    assert.ok(div, 'Container div rendered');
    assert.ok(h1, 'h1 rendered inside container');
    assert.equal(h1.textContent, 'Hello');
});

test('Functional components still receive children as second argument (Legacy)', () => {
    const container = document.getElementById('root');
    container.innerHTML = '';

    function LegacyContainer(props, children) {
        return Bunnix('div', { id: 'legacy' }, children);
    }

    const App = Bunnix(LegacyContainer, {}, [
        Bunnix('span', {}, 'Legacy')
    ]);

    render(App, container);

    const div = container.querySelector('#legacy');
    assert.ok(div);
    assert.equal(div.textContent, 'Legacy');
});

test('Functional component defaults to empty props if undefined in VDOM', () => {
    const container = document.getElementById('root');
    container.innerHTML = '';

    // Simulate manual VDOM construction where props is missing
    const Comp = ({ val }) => Bunnix('div', {}, val || 'default');
    const vdom = { tag: Comp }; // No props property

    render(vdom, container);
    assert.equal(container.textContent, 'default');
});
