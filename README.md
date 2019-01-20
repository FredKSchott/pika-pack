<p align="center">
  <img alt="Logo" src="https://i.imgur.com/bUYlxms.png?1" width="420">
</p>

```
npm install @pika/pack
```

<p align="center">
  <strong>@pika/pack</strong> • Package publishing made painless!
</p>

## tl;dr

<br/>
<p align="center">
  <img alt="Logo" src="https://i.imgur.com/k8LIiYY.gif" width="640">
</p>
<br/>

## What is @pika/pack?

**Pack is a new, holistic approach to package building using simple, pluggable builders.**

Authoring JavaScript in 2013 was simple: Write JavaScript and hit `npm publish`.

6 years later and things are more complicated: The modern JavaScript that we write (and TypeScript, and Flow, and Reason, and...) no longer runs natively on Node.js. But compiling for Node.js can leave web users with bloated, slower code.  As a result, package authors are stuck fiddling endlessly with tooling & configuration files hoping to get things just right.

In the words of npm: ["Everybody would like less tooling"](https://medium.com/npm-inc/this-year-in-javascript-2018-in-review-and-npms-predictions-for-2019-3a3d7e5298ef).

**@pika/pack approaches the problem differently: we build the entire package.** Simple, pluggable builders compile your code, process any assets, AND configure your `package.json` manifest with all entrypoints added automatically.

- Writing JavaScript but want to publish type definitions? Add `@pika/types-builder` to generate them automatically.
- Want a simple CLI interface for your library? Add `@pika/simple-bin` and your `package.json` will point to one automatically.
- Publish WASM to npm with JS bindings using any of our "WASM Builders" below.
- See the full list of builders below →

## Quickstart

All you need to do is define a build pipeline in your source project's `package.json` manifest:

```js
/* ./package.json */

{
  "name": "simple-package",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
      ["@pika/node-builder"],
      ["@pika/web-builder"],
      ["@pika/types-builder"]
    ]
  },
  // ...
}
```

No other configuration or tooling needed! When you run `pika build` you'll get a `pkg/` build directory optimized for npm, with `package.json` entrypoints (like `"main"` and `"module"`) added automatically:

```js
/* pkg/package.json */
{
  "name": "simple-package",
  "version": "1.0.0",
  "esnext": "dist-src/index.js",
  "main": "dist-node/index.js",
  "module": "dist-web/index.js",
  "types": "dist-types/index.d.ts",
  "sideEffects": false,
  "files": [
    "dist-*/",
    "assets/",
    "bin/"
  ]
}
```

[See a full collection of example projects here →](https://github.com/pikapkg/examples)


## Available Builders

#### Source Builders:
- `@pika/plugin-standard-pkg`: Compiles JavaScript/TypeScript to ES2018.
- `@pika/plugin-ts-standard-pkg`: Compiles TypeScript to ES2018 (Uses `tsc` instead of Babel, includes type definitions).

#### Dist Builders:
- `@pika/node-builder`: Builds a distribution that runs on Node LTS (v6+).
- `@pika/web-builder`: Builds an ESM distribution optimized for browsers & bundlers.
- `@pika/types-builder`: Builds TypeScript definitions from your TS, or automatically generate them from your JS.
- `@pika/deno-builder`: Builds a distribution that runs on Deno.

#### WASM Builders:
- `@pika/assemblyscript-builder`: Builds WASM from TypeScript.
- `@pika/bucklescript-builder`: Builds WASM from ReasonML/OCAML.
- `@pika/simple-wasm-wrapper`: Builds simple JS binding for any WASM build.

#### Advanced Builders:
- `@pika/node-bundler`: Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
- `@pika/web-bundler`: Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving directly to browsers.
- `@pika/simple-bin`: Generates & configures a bin entrypoint file to run your library.
- *Write your own!* @pika/pack can load local builders by relative path directly from your repo.
- *Publish & Share your own!* These official builders are just the start.

[See a full list of official builders here →](https://github.com/pikapkg/builders/tree/master/packages)


## pika build

![Imgur](https://i.imgur.com/C8hXcvw.png)

## pika publish

Based on the popular [`np`](https://github.com/sindresorhus/np) package! Validates your directory before running you through the publish process step-by-step to publish your `pkg/` sub-directory package.
![publish screenshot](https://imgur.com/SPjSRGN.png)
