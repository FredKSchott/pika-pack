<p align="center">
  <img alt="Logo" src="https://i.imgur.com/bUYlxms.png?1" width="420">
</p>

<p align="center">
  <strong>@pika/pack</strong> • A simple, holistic approach to package building & publishing.
</p>

<p align="center">
  <img alt="Logo" src="https://i.imgur.com/AcceGHG.gif" width="720">
</p>

## @pika/pack is a completely new approach to package building.

- 🏋️‍♀️ **Easy to Use:** Compose your package build out of pluggable, zero-configuration builders.
  - Say goodbye to complex bundlers and config files!
  - Simple enough for anyone to pick up, but expressive enough to handle the trickiest packages.
- ⚡️ **Optimized by Default:** Each build plugin optimizes your code for one specific environment.
  - Stop publishing bloated, transpiled, Node.js-specific JavaScript to all consumers.
  - Create a web-optimized ESM build, auto-generate TypeScript definitions, build for [Deno](https://deno.land/)...
- ⚛️ **Holistic:** @pika/pack handles everything, including `package.json` entry-points (like "main" & "module").
  - Really, when we say simple, we mean it!
  - Just add a one-line build plugin and it handles the rest, from compilation to configuration.
  - Builds only include needed files by default: no more `"files"`/`.npmignore` settings to worry about out.

<!--
The result of running @pika/pack is a self-contained, ready-to-run `pkg/` dir. Link it, run it locally, and publish it to npm when you're ready!
-->

## Quickstart

```
npm install --global @pika/pack
```

To get started, just define a build `"pipeline"` in your source project's `package.json` manifest (similar to the `"plugins"` section of a `.babelrc` file). Add the build plugins for the environments/features you care about, aaaaaand... that's it! Run `pika build` to build your package into a self-contained `pkg/` directory, compiled for each environment and automatically configured with all neccessary `package.json` entry-points (like `"main"` and `"module"`).

```js
/* Before: Your Project package.json */

{
  "name": "simple-package",
  "version": "1.0.0",
  "@pika/pack": {
    // Define the pipeline that will build your package:
    "pipeline": [
      // 1. Compiles your source to standard ES2018+
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
      // 2. Creates a distribution optimized to run on Node.js
      ["@pika/plugin-build-node"],
      // 3. Creates a distribution optimized for web browsers & bundlers
      ["@pika/plugin-build-web"],
      // 4. Automatically generates type definitions from your JavaScript
      ["@pika/plugin-build-types"]
    ]
  },
  // ...
}
```

```js
/* After: Your generated `pkg/` package.json manifest: */

{
  "name": "simple-package",
  "version": "1.0.0",
  "esnext": "dist-src/index.js",
  "main": "dist-node/index.js",
  "module": "dist-web/index.js",
  "types": "dist-types/index.d.ts",
  "sideEffects": false,
  "files": ["dist-*/", "assets/", "bin/"]
}
```

[See a full collection of example projects here →](https://github.com/pikapkg/examples)


## Available Builders

#### Source Builders:

> **NOTE: Make sure include a source builder early in your pipeline.** Source builders take your modern source code (ESNext, TS, etc.) and compile it to standard, ES2018 JavaScript. Other builders will then use this standardized build to base their own work off of.

 - `@pika/plugin-standard-pkg`: Compiles JavaScript/TypeScript to ES2018. Supports personalized, top-level `.babelrc` plugins/config.
 - `@pika/plugin-ts-standard-pkg`: Compiles TypeScript to ES2018 (Uses `tsc` internally instead of Babel, and builds type definitions automatically).

#### Distribution Builders:

 - `@pika/plugin-build-deno`: Builds a distribution that runs on Deno (TS projects only).
 - `@pika/plugin-build-node`: Builds a distribution that runs on Node LTS (v6+).
 - `@pika/plugin-build-types`: Builds TypeScript definitions from your TS, or automatically generate them from your JS. Not required if you use `@pika/plugin-ts-standard-pkg`.
 - `@pika/plugin-build-web`: Builds an ESM distribution optimized for browsers & bundlers.

#### WASM Builders:
 - `@pika/plugin-wasm-assemblyscript`: Builds WASM from TypeScript using [AssemblyScript](https://github.com/AssemblyScript/assemblyscript).
 - `@pika/plugin-wasm-bucklescript`: Builds WASM from ReasonML/OCAML using [BuckleScript](https://bucklescript.github.io/).
 - `@pika/plugin-wasm-bindings`: Builds a simple JS wrapper for any WASM build.

#### Advanced Builders:
 - `@pika/plugin-bundle-node`: Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
 - `@pika/plugin-bundle-web`: Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving code directly to browsers.
 - `@pika/plugin-simple-bin`:  Generates & configures a CLI wrapper to run your library from the command line.
- **Write your own!** @pika/pack can load local builders by relative path directly from your repo.
- **Publish & Share your own!** These official builders are just the start. Create a PR to add your community plugin to this list.

[See a full list of official builders here →](https://github.com/pikapkg/builders/tree/master/packages)


## Commands

### pika build

<p align="center">
  <img alt="Logo" src="https://i.imgur.com/AcceGHG.gif" width="720">
</p>


### pika publish

Based on the popular [`np`](https://github.com/sindresorhus/np) package! Validates your directory before running you through the publish process step-by-step to publish your `pkg/` sub-directory package.


<p align="center">
  <img alt="Logo" src="https://i.imgur.com/jDuCvhg.gif" width="720">
</p>

