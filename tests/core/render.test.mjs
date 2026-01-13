import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { useEffect, useState } from '../../index.mjs';

test('Bunnix.render mounts content into a container', () => {
    const container = document.createElement('div');
    Bunnix.render(Bunnix('div', { id: 'root' }, 'Hello'), container);
    assert.equal(container.querySelector('#root')?.textContent, 'Hello');
});

test('Bunnix renders SVG elements with the proper namespace', () => {
    const container = document.createElement('div');
    const view = Bunnix('svg', { width: '10', height: '10' }, [
        Bunnix('circle', { cx: '5', cy: '5', r: '4', fill: 'currentColor' })
    ]);

    Bunnix.render(view, container);

    const svg = container.querySelector('svg');
    const circle = container.querySelector('circle');
    assert.ok(svg);
    assert.ok(circle);
    assert.equal(svg.namespaceURI, 'http://www.w3.org/2000/svg');
    assert.equal(circle.namespaceURI, 'http://www.w3.org/2000/svg');
});

test('Bunnix renders HTML elements without the SVG namespace', () => {
    const container = document.createElement('div');
    Bunnix.render(Bunnix('div', { id: 'box' }, 'Hi'), container);

    const div = container.querySelector('div');
    assert.ok(div);
    assert.equal(div.namespaceURI, 'http://www.w3.org/1999/xhtml');
});

test('state can bind to inline styles', () => {
    const color = useState('rgb(0, 0, 0)');
    const container = document.createElement('div');

    Bunnix.render(
        Bunnix('div', { style: { color } }, 'Color'),
        container
    );

    const node = container.querySelector('div');
    assert.equal(node.style.color, 'rgb(0, 0, 0)');

    color.set('rgb(255, 0, 0)');
    assert.equal(node.style.color, 'rgb(255, 0, 0)');
});

test('form input toggles submit disabled state via effect', () => {
    const text = useState('');
    const isDisabled = useState(true);

    useEffect((value) => {
        isDisabled.set(!value);
    }, [text]);

    const Form = () => (
        Bunnix('form', {}, [
            Bunnix('input', {
                type: 'text',
                change: (event) => text.set(event.target.value)
            }),
            Bunnix('button', { type: 'submit', disabled: isDisabled }, 'Submit')
        ])
    );

    const container = document.createElement('div');
    Bunnix.render(Form, container);

    const input = container.querySelector('input');
    const button = container.querySelector('button');
    assert.ok(input);
    assert.ok(button);
    assert.equal(button.disabled, true);

    input.value = 'hello';
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(button.disabled, false);

    input.value = '';
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(button.disabled, true);
});
