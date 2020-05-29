# Contribution

### Contents

 1. [Ways to contribute]()
 2. [Community Guidelines]()
 3. [Adding packages]()
 4. [Posting issues]()
 5. [Posting PRs]()

### Ways to contribute

Do you want to help make LibP2P data more observable and explorable? There are four main ways you can get involved:

- **Create widgets using LibP2P Observer**. The LibP2P Observer provides an [SDK package]() and quickstart [`create-`]() script to facilitate building "widgets" consuming, visualising and exploring LibP2P Introspection data.
  - See the [docs for the create-widget package]().
- **Create catalogues of LibP2P Observer widgets**. The LibP2P Observer [catalogue]() package may be imported and used to connect a collection of LibP2P Observer widgets to LibP2P introspection data and the [LibP2P Observer shell](). These may be run either as a standalone React app (and the [app package]() gives a simple example of this), or as a component within another React app.
  - See the [docs for the catalogue package]().
- **Contribute a widget to the public LibP2P Observation Deck**. If you believe a widget you have worked on is useful to others in the LibP2P community, you may submit it for review to be included in Protocol Labs' "LibP2P Observation Deck", a public catalogue of useful LibP2P Observer apps that have been approved as meeting a quality threshold.
  - See the [contribution guidelines on the LibP2P Observation Deck repo]().
- **Help develop and maintain LibP2P Observer itself**. This project welcomes open source contributions who either have, or wish to sharpen, skills in React, data visualisation, Protobuf and node.js data handling.
  - See the remainder of this document!

### Community Guidelines

As part of the LibP2P project, our community guidelines echo [those of the LibP2P project](https://github.com/libp2p/community/blob/master/CONTRIBUTE.md#community-guidelines).

### Adding packages

This repository is a Lerna "Monorepo" managing multiple interlinked packages. It is not expected that contributors would have cause to create new packages in this monorepo, unless as part of a pre-agreed initiative.

The widgets included in this monorepo, such as `connections-table`, are intended as a small set of generic examples and core features that every release of LibP2P Observer will be automatically tested against. If you want to create a new widget, the expected workflow is:

 1. Create it as a standalone repository using the `create-widget` package
 2. Publish and maintain it on your own or your company's GitHub account
 3. If you believe it has widespread value to the LibP2P community and wish to share it directly, publish it to NPM and submit it for review by posting a PR to the [LibP2P Observation Deck repo]() which adds your published package to the listed of approved widgets.

Please see the [LibP2P Observation Deck community guidelines for more details]()

### Posting bug reports, feature requests and discussions

Bug reports, ideas and feature requests are always welcome, and a bug report template is provided for posting issues. Please follow this template wherever possible!

Please also note that feature requests on this repo should be limited to the scope of the packages in this monorepo, such as:

 - `catalogue` for features usable when browsing and selecting widgets in any collection of LibP2P Observer widgets
 - `data` for Javascript helper functions facilitating common operations on LibP2P introspection data.
 - `samples` for improvements to our node.js mock LibP2P introspection data generator
 - `sdk` for universal base components and hooks usable by a wide variety of LibP2P Observer widgets
 - `shell` for global controls applicable to all LibP2P Observer widgets

Requests for any of the following should be posted to and discussed on the [Libp2p Observation Deck]() instead:

 - Ideas or requests for new widgets you'd like to see, use or build
 - Requests for a way to explore data that aren't coverred by this repo's built-in widgets
 - Ideas or requests for new ways to visualise the data visualised in a built-in LibP2P Observer widget.
- Forks of built-in LibP2P Observer widgets that take them in a different or more specialised direction: for example, a fork of `connections-table` that replaces some columns with ones more applicable to your project.

### Posting PRs

PRs are welcome and will be reviewed by the core team. Please understand that our capacity is limited and we cannot guarentee a fast reply, but we will give your work the attention it deserves as quickly as we are able to.

Please consider posting what you intend to do as an issue first to ensure no effort is wasted, and refer to the [Developer Guide](developer-guide.md)
