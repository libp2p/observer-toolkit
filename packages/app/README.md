# `app` @libp2p/observer-app

Demo app which deploys the [libp2p Observer catalogue](../catalogue) with each example widget bundled in the libp2p Observer repo.

This is deployed using [CRACO](https://www.npmjs.com/package/@craco/craco), which is based on [Create React App](https://github.com/facebook/create-react-app/) allowing additional configuration such as allowing custom binary sample files to be imported in builds.

## Usage

This app is auto-deployed to http://libp2p.github.io/libp2p-observer/ on each push to the `master` or `staging` branches, following the GitHub action defined in [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml).

To deploy a local development build, run `npm run start:app` in the root libp2p Observer directory. This will automatically update as you make any changes to libp2p Observer packages.
