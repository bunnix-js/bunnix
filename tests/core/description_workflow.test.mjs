import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const workflow = readFileSync(new URL('../../.github/workflows/validate-pr-description.yml', import.meta.url), 'utf8');
const releaseBody = 'Following fixes were applied to the `0.10.1` version:\n\n' +
    '- Fixed vulnerabilities on `ws` and `jsdom` packages\n' +
    '- Fixed misaligned types def and documentations on public bunnix api.';

function validate(stepName, prefix, title, body) {
    const step = workflow.split(`      - name: ${stepName}\n`)[1]?.split('      - name: ')[0];
    assert.ok(step, 'Validation step must exist');
    const script = step.split('        run: |\n')[1]
        .split('\n').map(line => line.replace(/^ {10}/, '')).join('\n');
    // Reproduce GitHub's pre-shell expression substitution if it is reintroduced.
    const context = prefix === 'PR' ? 'pull_request' : 'issue';
    const rendered = script.replace(/\$\{\{ github\.event\.(pull_request|issue)\.(title|body) \}\}/g,
        (_, event, field) => event === context ? (field === 'title' ? title : body) : '');
    return spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', rendered], {
        encoding: 'utf8',
        env: { ...process.env, [`${prefix}_TITLE`]: title, [`${prefix}_BODY`]: body }
    });
}

for (const [step, prefix] of [['Validate Pull Request', 'PR'], ['Validate Issue', 'ISSUE']]) {
    test(`${prefix} validation accepts the reported release description with Markdown backticks`, () => {
        const result = validate(step, prefix, '@bunnix/core release 0.10.1 ', releaseBody);
        assert.equal(result.status, 0, result.stderr);
        assert.equal(result.stderr, '');
    });

    test(`${prefix} validation treats quotes, substitutions, and newlines as literal text`, () => {
        const text = 'Quoted "text"; $(printf EXECUTED >&2) `printf EXECUTED >&2`\nsecond line';
        const result = validate(step, prefix, text, text);
        assert.equal(result.status, 0, result.stderr);
        assert.equal(result.stderr, '', 'Description text must never execute');
        assert.ok(result.stdout.includes(text), 'Title must remain literal');
    });

    test(`${prefix} validation still rejects empty and too-short titles and descriptions`, () => {
        for (const [title, body] of [['', releaseBody], ['1234', releaseBody], ['Valid title', ''], ['Valid title', 'x'.repeat(19)]]) {
            const result = validate(step, prefix, title, body);
            assert.equal(result.status, 1);
            assert.match(result.stdout, /required and must be at least/);
        }
        assert.equal(validate(step, prefix, '12345', 'x'.repeat(20)).status, 0);
    });
}
