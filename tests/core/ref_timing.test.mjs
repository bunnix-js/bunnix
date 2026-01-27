import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { useEffect, useRef, render } from '../../index.mjs';

test('useRef content is available in microtask from useEffect', async () => {
    const container = document.createElement('div');
    let capturedImmediate = 'unset';
    let capturedMicrotask = 'unset';
    
    let finishTest;
    const testPromise = new Promise(resolve => {
        finishTest = resolve;
    });

    const App = () => {
        const ref = useRef();

        useEffect(() => {
            capturedImmediate = ref.current;
            
            queueMicrotask(() => {
                capturedMicrotask = ref.current;
                finishTest();
            });
        }, []);

        return Bunnix('div', { ref, id: 'ref-target' });
    };

    render(App, container);
    
    await testPromise;

    assert.equal(capturedImmediate, null, 'ref.current should be null immediately inside useEffect');
    assert.ok(capturedMicrotask instanceof window.Node, 'ref.current should be a Node in microtask');
    assert.equal(capturedMicrotask.id, 'ref-target');
});
