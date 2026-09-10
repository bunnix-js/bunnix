import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function stagePackage(pkg, run) {
    const versions = run(['view', pkg.name, 'versions', '--json']);
    const published = Array.isArray(versions) ? versions : [versions];
    if (published.includes(pkg.version)) {
        return `${pkg.name}@${pkg.version} is already published. Staging skipped.`;
    }

    // npm stage publish packs the working directory and returns its stage ID.
    const result = run(['stage', 'publish', '--access', 'public', '--json']);
    const staged = result[pkg.name];
    assert.ok(staged, 'npm did not return the requested package');
    assert.equal(staged.name, pkg.name, 'Staged package name does not match');
    assert.equal(staged.version, pkg.version, 'Staged package version does not match');
    assert.match(staged.stageId ?? '', /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
        'npm did not return a valid stage ID');
    assert.match(staged.shasum ?? '', /^[0-9a-f]{40}$/i, 'npm did not return a package checksum');

    const verified = run(['stage', 'view', staged.stageId, '--json']);
    assert.equal(verified.id, staged.stageId, 'Stage ID verification failed');
    assert.equal(verified.packageName, pkg.name, 'Stage package verification failed');
    assert.equal(verified.version, pkg.version, 'Stage version verification failed');
    assert.equal(verified.shasum, staged.shasum, 'Stage checksum verification failed');

    return `${pkg.name}@${pkg.version} staged and verified.\n\nStage ID: ${staged.stageId}\n\n` +
        'Awaiting manual approval by a package maintainer on npmjs.com (Staged Packages tab), with 2FA. ' +
        'This workflow has not published the package.';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const run = args => JSON.parse(execFileSync('npm', args, {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']
    }));
    const summary = stagePackage(pkg, run);
    console.log(summary);
    if (process.env.GITHUB_STEP_SUMMARY) {
        appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
    }
}
