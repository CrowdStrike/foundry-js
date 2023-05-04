# @crowdstrike/foundry-js

Foundry.js SDK

## Installation

For the time being, this package is published as a private package on the Github Packages npm registry.

Please follow the [official guide to install a package from Github Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package), the short version of which is:

- [Login to the npm.pkg.github.com registry using a personal access token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)
- add a `.npmrc` file with the following contents:

  ```
  @crowdstrike:registry=https://npm.pkg.github.com
  ```

- run `npm add @crowdstrike/foundry-js` (or the equivalent for `yarn` or `pnpm`)

> Note that you currently [cannot associate a npm scope with multiple registries](https://stackoverflow.com/questions/70183907/defining-a-specific-registry-for-a-specific-package-in-npmrc-file), so with the above setup you are not able to install other `@crowstrike/*` packages that are hosted on the public npm registry!

## Usage

TODO
