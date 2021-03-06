# verify-istanbul-coverage

[![Build Status](https://travis-ci.org/joshuakgoldberg/verify-istanbul-coverage.svg?)](https://travis-ci.org/joshuakgoldberg/verify-istanbul-coverage)
[![NPM version](https://badge.fury.io/js/verify-istanbul-coverage.svg)](http://badge.fury.io/js/verify-istanbul-coverage)

Verifies minimum total covered lines in generated Istanbul reports.

## Usage

### CLI

```shell
npm i -g verify-istanbul-coverage
```

```shell
verify-istanbul-coverage
```

#### Flags

* `f`/`--file`: File path to read from. Defaults to `./coverage/lcov-report/index.html`.
* `-m`/`--minimum`: Minimum expected coverage. Defaults to `100`.

### Node.js

```javascript
import { VerificationStatus, verifyCoverage } from "verify-istanbul-coverage";

async main() {
    const coverage = await verifyCoverage();

    if (coverage.status === VerificationStatus.Successful) {
        console.log("All is well!");
    } else {
        console.error(`Failed: expected coverage to be at least ${coverage.minimum} but found ${coverage.actual}.`);
        console.log(`Check ${coverage.file}.`);
    }
}

main()
    .catch((error) => {
        console.error(`Error verifying coverage: ${error}`);
    });
```

Long names of flags can be passed as object members to `verifyCoverage`.
See [`./index.ts`](./src/index.ts) for the full typings.

## Development

First clone the repository and install its dependencies:

```shell
git clone https://github.com/joshuakgoldberg/verify-istanbul-coverage
cd verify-istanbul-coverage
npm i
```

* `npm run watch` runs TypeScript in watch mode.
* `npm run lint` lints with TSLint.
* `npm run test` runs tests in watch mode.
* `npm run prepublish` builds code and runs tests.
