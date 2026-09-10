---
layout: default
title: Publishing
---

# Publishing

Pushes and merges into `main` run the **Stage npm package** workflow. It uses
Node.js 24 and npm 11.15.0, installs dependencies, runs the tests, then stages the
version in `package.json` using `npm stage publish`. The existing `NPM_TOKEN`
repository secret must have write access to `@bunnix/core`; staging does not
require a token that bypasses 2FA. The package must already exist on npm.

The workflow verifies the returned stage ID, package name, version, and tarball
checksum with `npm stage view`. Its summary contains the stage ID only after
verification succeeds. Registry, authentication, staging, and verification errors
fail the job. An exact version already published on npm is skipped. If that
version is already staged, npm rejects a duplicate; review the existing stage
before retrying rather than automatically replacing it.

A maintainer with package write access and 2FA must open the **Staged Packages**
tab on npmjs.com, review the package, and click **Approve** to publish it.
CI never approves or directly publishes the package.

The linked GitHub release workflow creates a draft for the tested commit.
Publish that draft manually after confirming the version is live on npm.

See [npm staged publishing](https://docs.npmjs.com/staged-publishing/) for the
staging and manual approval requirements.
