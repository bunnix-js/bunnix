import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { useState, useEffect, useMemo, Show, ForEach } from '../../index.mjs';

test('Effect throws when dependency is a primitive', () => {
    assert.throws(() => {
        useEffect(() => {}, [123]);
    }, /Expected a State object but received number/);

    assert.throws(() => {
        useEffect(() => {}, [useState(1), 'string']);
    }, /Expected a State object but received string/);
});

test('Compute/useMemo throws when dependency is a primitive', () => {
    assert.throws(() => {
        useMemo([123], () => {});
    }, /Expected a State object but received number/);
});

test('Show throws when state is a primitive', () => {
    assert.throws(() => {
        Show(true, () => {});
    }, /Expected a State object but received boolean/);
});

test('ForEach throws when items is a primitive', () => {
    assert.throws(() => {
        ForEach(123, {}, () => {});
    }, /Expected a State object but received number/);
});

test('ForEach allows arrays (legacy static support)', () => {
    assert.doesNotThrow(() => {
        const frag = ForEach([1, 2, 3], {}, (i) => Bunnix('div', {}, i));
    });
});

test('RefState passes validation', () => {
    const ref = Bunnix.useRef(null);
    assert.doesNotThrow(() => {
        useEffect(() => {}, [ref]);
    });
});
