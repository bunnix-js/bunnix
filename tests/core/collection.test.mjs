import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix from '../../index.mjs';

test('can render arrays from map()', () => {
    const items = ['A', 'B', 'C'];
    const list = Bunnix('ul', {}, items.map((item) => Bunnix('li', {}, item)));

    const container = document.createElement('div');
    Bunnix.render(list, container);

    const nodes = container.querySelectorAll('li');
    assert.equal(nodes.length, 3);
    assert.equal(container.textContent, 'ABC');
});
