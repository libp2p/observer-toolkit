# `create-widget` @libp2p/create-observer-widget

This script, compatible with `yarn create` and `npm init`, kickstarts the creation of a widgets for visualising libp2p Introspection data. When run in an empty directory, this script:

 - Writes a `package.json` file with the core dependencies necessary for a libp2p Observer widget
 - Writes core files to export the expected combination set of React `Widget` component, markdown `description`, `name` string, `screenshot` and `tags`
 - Creates a base central component file for the new widget
 - Writes files connecting this to Storybook and [@libp2p/observer-shell](../shell) allowing immediate live-updating in-browser testing with sample libp2p Introspection data files
 - Sets up config files to match libp2p Observer's lint and testing standards

## Usage

To bootstrap a new widget project built on the libp2p Observer:

- Create and navigate to a new, empty project directory
- Run either:

```sh
yarn create @libp2p/create-observer-widget
```

...or:

```sh
npm init @libp2p/create-observer-widget
```

- Follow the CLI prompts to fill in widget name and optional fields like description
- Use `npm install` or `yarn install` to install dependencies
- Use `npm run storybook` to start Storybook, launching a hot-reloading dev build of the widget in a browser linked to sample data

After doing this, you are ready to start developing the widget and see changes show automatically in Storybook.
