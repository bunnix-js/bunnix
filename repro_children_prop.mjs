import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { render } from './index.mjs';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>');
global.document = dom.window.document;
global.Node = dom.window.Node;

test('Functional components receive children in props (React-style)', () => {
    const container = document.getElementById('root');
    container.innerHTML = '';

    // User Scenario
    function MyContainer({ children }) {
        // Expect children to be in the first argument
        return Bunnix('div', { id: 'container' }, children);
    }

    // <MyContainer><h1>Hello</h1></MyContainer>
    // Translates to:
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
