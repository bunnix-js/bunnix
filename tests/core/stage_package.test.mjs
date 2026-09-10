import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stagePackage } from '../../.github/scripts/stage-package.mjs';

const pkg = { name: '@bunnix/core', version: '0.10.1' };
const stageId = '12345678-1234-1234-1234-123456789abc';
const shasum = 'a'.repeat(40);
// npm 11.15.0 --json uses a package-name key for stage publish output.
const staged = { [pkg.name]: { ...pkg, stageId, shasum } };
const verified = { id: stageId, packageName: pkg.name, version: pkg.version, shasum };

function runner(responses) {
    const calls = [];
    return {
        calls,
        run(args) {
            calls.push(args);
            assert.ok(responses.length, 'Unexpected npm command');
            const response = responses.shift();
            if (response instanceof Error) throw response;
            return response;
        }
    };
}

test('stages current version and verifies its registry metadata and checksum', () => {
    const { run, calls } = runner([['0.10.0'], staged, verified]);
    const summary = stagePackage(pkg, run);
    assert.deepEqual(calls, [
        ['view', pkg.name, 'versions', '--json'],
        ['stage', 'publish', '--access', 'public', '--json'],
        ['stage', 'view', stageId, '--json']
    ]);
    assert.match(summary, /staged and verified/);
    assert.ok(summary.includes(stageId));
    assert.match(summary, /manual approval.*2FA/);
});

test('skips an already published exact version even when it is not latest', () => {
    const { run, calls } = runner([['0.10.0', '0.10.1', '0.11.0']]);
    assert.match(stagePackage(pkg, run), /already published/);
    assert.equal(calls.length, 1);
});

test('registry lookup errors stop staging instead of being treated as missing versions', () => {
    const { run, calls } = runner([new Error('Registry unavailable')]);
    assert.throws(() => stagePackage(pkg, run), /Registry unavailable/);
    assert.equal(calls.length, 1);
});

test('staging errors fail without attempting approval or verification', () => {
    const { run, calls } = runner([['0.10.0'], new Error('Stage rejected')]);
    assert.throws(() => stagePackage(pkg, run), /Stage rejected/);
    assert.equal(calls.length, 2);
});

test('a successful command without a stage ID is not accepted as staging success', () => {
    const { run, calls } = runner([[], { [pkg.name]: { ...pkg, shasum } }]);
    assert.throws(() => stagePackage(pkg, run), /valid stage ID/);
    assert.equal(calls.length, 2);
});

test('stage verification rejects mismatched identity, version, and tarball checksum', () => {
    for (const field of ['id', 'packageName', 'version', 'shasum']) {
        const { run } = runner([[], staged, { ...verified, [field]: 'wrong' }]);
        assert.throws(() => stagePackage(pkg, run), /verification failed/);
    }
});

test('stage lookup errors fail the workflow', () => {
    const { run } = runner([[], staged, new Error('Stage not found')]);
    assert.throws(() => stagePackage(pkg, run), /Stage not found/);
});
