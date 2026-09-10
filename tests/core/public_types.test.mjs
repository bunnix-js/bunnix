import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as api from '../../index.mjs';

test('public declarations compile supported usage and reject unsupported APIs', () => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    execFileSync(process.execPath, [
        'node_modules/typescript/bin/tsc', '--noEmit', '--strict',
        '--module', 'NodeNext', '--target', 'ES2022',
        'tests/types/public-api.mts'
    ], { cwd: root, stdio: 'pipe' });
});

test('public constructor exports match documented aliases', () => {
    assert.equal(Object.hasOwn(api, 'State'), false);
    assert.equal(Object.hasOwn(api, 'Effect'), false);
    assert.equal(api.Bunnix.State, api.useState);
    assert.equal(api.Bunnix.Effect, api.useEffect);
    assert.equal(api.Bunnix.Compute, api.useMemo);
    assert.equal(api.Bunnix.Ref, api.useRef);
});
