# `create-widget`

Third party libp2p observer widgets can be developed by pulling in the SDK package. To bootstrap a new widget project that can be used with the libp2p observer, make sure to:

- create and navigate to a new project directory
- bootstrap the creation of a new widget with `npm init @libp2p-observer/create-widget` and follow the CLI prompts to fill in widget name and optional fields like description
- use `npm install` or `yarn install` to install dependencies
- use `npm run storybook` to start Storybook, launching a hot-reloading dev build of the widget in a browser linked to sample data

Now your ready to start developing the widget and see changes show automatically in Storybook.
