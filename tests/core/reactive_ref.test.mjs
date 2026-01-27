import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { useEffect, useRef, render } from '../../index.mjs';

test('useRef is reactive and read-only', async () => {
    const container = document.createElement('div');
    const log = [];
    
    const App = () => {
        const divRef = useRef(null);
        
        useEffect((node) => {
            if (node) log.push(node.tagName);
        }, [divRef]);

        // Security Check: User cannot set it via public API
        assert.equal(divRef.set, undefined, 'Ref should not have a public .set method');

        return Bunnix('div', { ref: divRef, id: 'target' });
    };

    render(App, container);
    
    assert.deepEqual(log, ['DIV'], 'Effect should have been triggered with the DIV element');
});

test('Manual ref.current assignment does not trigger reactivity', () => {
    const ref = useRef(null);
    let count = 0;
    ref.subscribe(() => count++);

    // Manual set - acts as plain prop, no broadcast
    ref.current = 'fake'; 
    assert.equal(count, 0, 'Manual assignment should not trigger subscribers'); 
    assert.equal(ref.current, 'fake', 'Value should be updated in the object');

    // System set (via Symbol) triggers update
    const setter = ref[Symbol.for('bunnix.ref.set')];
    assert.ok(typeof setter === 'function', 'Internal setter Symbol should be present');
    
    setter('real');
    assert.equal(count, 1, 'System setter should trigger subscribers');
    assert.equal(ref.current, 'real', 'Value should be updated to real');
});

test('useRef works with initial value', () => {
    const ref = useRef('initial');
    assert.equal(ref.current, 'initial');
    assert.equal(ref.get(), 'initial');
});
