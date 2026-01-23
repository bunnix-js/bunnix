import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { useState, render, Show } from '../../index.mjs';

test('Show passes state value to render function', () => {
    const name = useState('Alice');
    const container = document.createElement('div');

    // Use mapped state that is always truthy to test value passing
    const derived = name.map(n => n || 'Anonymous');
    
    const App = () => Show(
        derived,
        (val) => Bunnix('span', {}, `Hello ${val}`)
    );

    render(App, container);
    assert.equal(container.textContent, 'Hello Alice');

    name.set(''); // Maps to 'Anonymous'
    assert.equal(container.textContent, 'Hello Anonymous');
    
    name.set('Bob');
    assert.equal(container.textContent, 'Hello Bob');
});

test('Show hides content on falsy value even with arg', () => {
    const show = useState(true);
    const container = document.createElement('div');
    
    const App = () => Show(
        show,
        (val) => Bunnix('div', {}, String(val))
    );

    render(App, container);
    assert.ok(container.querySelector('div'));

    show.set(false);
    assert.equal(container.querySelector('div'), null);
});
