import assert from 'node:assert/strict';
import { test } from 'node:test';
import { useState, useMemo } from '../../index.mjs';

test('useMemo works with mixed state and plain value dependencies', () => {
    const data = ['Apple', 'Banana', 'Avocado'];
    const search = useState('A');
    
    const filtered = useMemo(
        [search, data], 
        (s, d) => d.filter(item => item.startsWith(s))
    );

    assert.deepStrictEqual(filtered.get(), ['Apple', 'Avocado']);

    search.set('B');
    assert.deepStrictEqual(filtered.get(), ['Banana']);
});

test('useMemo still works with all-state dependencies', () => {
    const a = useState(1);
    const b = useState(2);
    const sum = useMemo([a, b], (valA, valB) => valA + valB);
    
    assert.strictEqual(sum.get(), 3);
    a.set(10);
    assert.strictEqual(sum.get(), 12);
});

test('useMemo does not react to plain value changes (by design)', () => {
    let data = ['Apple', 'Banana'];
    const search = useState('A');
    
    const filtered = useMemo(
        [search, data], 
        (s, d) => d.filter(item => item.startsWith(s))
    );

    assert.deepStrictEqual(filtered.get(), ['Apple']);
    
    // Mutate plain data - useMemo should NOT react to this
    data.push('Avocado');
    assert.deepStrictEqual(filtered.get(), ['Apple'], 'useMemo should not react to mutated plain dependencies');
});
