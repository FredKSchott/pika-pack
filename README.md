<p align="center">
  <img alt="Logo" src="https://next.pikapkg.com/static/img/new-logo1.png" width="320">
</p>

<p align="center">
  <strong>@pika/pack</strong> • package building, reimagined.
</p>

<p align="center">
  <img alt="Logo" src="https://i.imgur.com/AcceGHG.gif" width="720">
</p>

## @pika/pack is a simple, completely new approach to package building.

- 🏋️‍♀️ **Easy to Use:** Compose your package build out of pluggable, zero-configuration builders.
  - Say goodbye to complex bundlers and configuration files!
- ⚡️ **Optimized by Default:** Each build plugin optimizes your code for one specific environment.
  - Stop publishing bloated, transpiled, Node.js-specific JavaScript to all consumers.
- ⚛️ **Holistic:** @pika/pack handles everything, including `package.json` entrypoints like "main" & "module".
  - Builds only include necessary files: no more `"files"`/`.npmignore` configuration to worry about out.

Really, when we say simple, we mean it!

<!--
The result of running @pika/pack is a self-contained, ready-to-run `pkg/` dir. Link it, run it locally, and publish it to npm when you're ready!
-->

## Quickstart

1. **@pika/pack manages your build for you.** Say goodbye to complex bundlers and configuration files. The `pack build` command builds your modern JavaScript or TypeScript source code for any number of environments (Node.js, Web, and even Deno):
    ```bash
    $ npm install -g @pika/pack
    $ pack build
    ```

1. **You create a project pipeline out of simple, pluggable builders.** Builders are simple, single-purpose build plugins defined in your `package.json`. For example, `@pika/plugin-build-node` & `@pika/plugin-build-web` build your package for those different environments. Other, more interesting builders can bundle your web build for [unpkg](https://unpkg.com), generate TypeScript definitions from your JavaScript, addon a standard CLI wrapper for Node.js builds, and even compile non-JS languages to WASM (with JS bindings added).<br/><br/> Each builder is laser focused on just one task, which keeps builder configuration to a minimum (and in most cases, non-existent).
    ```js
    // Before: your top-level package.json manifest:
    {
      "name": "simple-package",
      "version": "1.0.0",
      "@pika/pack": {
        // Define the pipeline that will build your package:
        "pipeline": [
          // 1. (dist-src/) Compiles your source to standard ES2018
          ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
          // 2. (dist-node/) Build optimized to run on Node.js LTS+
          ["@pika/plugin-build-node"],
          // 3. (dist-web/) Build ESM for web browsers & bundlers
          ["@pika/plugin-build-web"],
          // 4. (dist-types/) `d.ts` files generated from JS automatically
          ["@pika/plugin-build-types"]
        ]
      },
      // ...
    }
    ```

1. **Builders handle everything, including package configuration.** Entrypoints like "main" & "module" are handled for you automatically, along with with sensible `package.json` defaults for things like "sideEffects" & "files".
    ```js
    // After: your built "pkg/" package.json manifest:
    {
      "name": "simple-package",
      "version": "1.0.0",
      // Multiple distributions, built & configured automatically:
      "esnext": "dist-src/index.js",
      "main": "dist-node/index.js",
      "module": "dist-web/index.js",
      "types": "dist-types/index.d.ts",
      // With sensible package defaults:
      "sideEffects": false,
      "files": ["dist-*/", "assets/", "bin/"]
    }
    ```


The result is a self-contained, ready-to-run `pkg/` build, with only the minimum set of required files included. Link it, run it locally, rebuild it, and publish it to npm when you're ready!

[See a full collection of example projects here →](https://github.com/pikapkg/examples)


## Available Builders

#### Source Builders:

> **NOTE: Include a source builder early in your pipeline.** Source builders take your modern source code (ESNext, TS, etc.) and compile it to standard, ES2018 JavaScript. Other builders will then use this standardized build to base their own work off of.

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


### Bonus Command: `publish`

<p align="center" style="margin-bottom: 0rem;">
  <img alt="Logo" src="https://i.imgur.com/jDuCvhg.gif" width="720">
</p>

Now that your package is built, what do you do? npm's "publish" command has also always left a lot to be desired. We're big fans of Sindre Sorhus's [np](https://github.com/sindresorhus/np) (a self-described "better npm publish") which adds an easy-to-follow, step-by-step flow to package publishing.

To make it as easy to publish pika-built packages as it is to build them, we've brought our favorite parts of [np](https://github.com/sindresorhus/np) into the new `pack publish` command. Running this in your top-level project will prompt you through version bumping, tagging, and finally releasing your self-contained `pkg/` sub-directory.
