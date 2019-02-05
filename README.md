<p align="center">
  <img alt="Logo" src="https://next.pikapkg.com/static/img/new-logo1.png" width="280">
</p>

<p align="center">
  <strong>@pika/pack</strong> • npm package building, reimagined.
</p>

<p align="center">
  <img alt="Demo" src="https://next.pikapkg.com/static/img/pack-build-demo.gif?" width="720">
</p>

## @pika/pack is a new approach to building npm packages

⚡️ **Simple:** Use pre-configured plugins to build your package for you.  
🏋️‍♀️ **Flexible:** Choose the plugins and optimizations that make sense for your package.  
⚛️ **Holistic:** Let us build & configure your entire package... *including package.json manifest.* . 


## Quickstart

Getting started is easy:

```js
// 1. Install it!
$ npm install -g @pika/pack
// 2. Add this to your package.json manifest:
"@pika/pack": {
  "pipeline": []
}
// 3. Run it!
$ pack build
```

🆒❗️ ... but now what? If you run `pack build` with an empty pipeline like that, you'll get an empty package build. 

**1. Create a project pipeline out of simple, pluggable builders.** Builders are simple, single-purpose build plugins defined in your `package.json`. For example, `@pika/plugin-build-node` & `@pika/plugin-build-web` build your package for those different environments. Other, more interesting builders can bundle your web build for [unpkg](https://unpkg.com), generate TypeScript definitions from your JavaScript, addon a standard CLI wrapper for Node.js builds, and even compile non-JS languages to WASM (with JS bindings added).

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

**2. Builders handle everything, including package configuration.** Entrypoints like "main" & "module" are handled for you automatically, along with with sensible `package.json` defaults for things like "sideEffects" & "files".

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


## Bonus Command: `publish`

<p align="center" style="margin-bottom: 0rem;">
  <img alt="Demo" src="https://next.pikapkg.com/static/img/publish-demo.gif" width="720">
</p>

We've brought our favorite parts of [np](https://github.com/sindresorhus/np) (a self-described "better npm publish") into @pika/pack. With the `publish` command there's no need to worry about how to publish your package once you've built it.

Run `pack publish` in your project and @pika/pack will walk you through version bumping, tagging your release, generating a fresh build, and finally publishing your package.
