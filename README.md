<p align="center">
  <img alt="Logo" src="https://i.imgur.com/bUYlxms.png?1" width="420">
</p>

<p align="center">
  <strong>@pika/pack</strong> • A simple, holistic approach to package building & publishing.
</p>

<p align="center">
  <img alt="Logo" src="https://i.imgur.com/rSY77ks.gif" width="680">
</p>

## What is @pika/pack?

Authoring JavaScript in 2013 was simple: Write JavaScript and hit `npm publish`.

6 years later and things are more complicated: Modern JavaScript (and TypeScript, and Flow, and Reason, and...) no longer runs everywhere. The best libraries ship legacy code for Node.js alongside modern code for web bundlers, type definitions for TypeScript/VSCode users, bundled code for UNPKG, and more. 

Of course it's up to you as the package author to figure all of this out on your own.

**@pika/pack approaches the problem differently:** 

- **Use simple, pluggable, zero-configuration builders to build your package.**
- Each builder compiles your modern code for a single environment (like Node.js, ESM, UNPKG, Deno). 
- Each builder configures your `package.json` entrypoints (like `"main"` and `"module"`) automatically.

The result is a self-contained, ready-to-run `pkg/` dir, optimized and small by default (so no more `"files"` or `.npmignore` configuration to worry about when you decide to publish).


## Quickstart

```
npm install --global @pika/pack
```

To use @pika/pack, define a build `"pipeline"` in your source project's `package.json` manifest (similar to the "plugins" section of a `.babelrc` file):

```js
/* ./package.json */

{
  "name": "simple-package",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      // 1. Compiles your source to standard ES2018+
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
      // 2. Creates a distribution to run on Node.js
      ["@pika/node-builder"],
      // 3. Creates a distribution to run on web browsers (optimized for bundlers)
      ["@pika/web-builder"],
      // 4. Generates type definitions from your JavaScript automatically
      ["@pika/types-builder"]
    ]
  },
  // ...
}
```

No other configuration or tooling needed! When you run `pika build` in your project you'll get a built `pkg/` directory, with all `package.json` entrypoints (like `"main"` and `"module"`) added automatically:

```js
/* Your generated `pkg/` package.json manifest: */
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
 - `@pika/plugin-standard-pkg`: Compiles JavaScript/TypeScript to ES2018.
 - `@pika/plugin-ts-standard-pkg`: Compiles TypeScript to ES2018 (Uses `tsc` instead of Babel, and builds type definitions automatically).

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

![Imgur](https://i.imgur.com/rSY77ks.gif)


### pika publish

Based on the popular [`np`](https://github.com/sindresorhus/np) package! Validates your directory before running you through the publish process step-by-step to publish your `pkg/` sub-directory package.
![publish screenshot](https://imgur.com/SPjSRGN.png)
