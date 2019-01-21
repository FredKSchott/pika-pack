<p align="center">
  <img alt="Logo" src="https://i.imgur.com/bUYlxms.png?1" width="420">
</p>

<p align="center">
  <strong>@pika/pack</strong> • A simple, holistic approach to package building & publishing.
</p>

<br/>
<p align="center">
  <img alt="Logo" src="https://i.imgur.com/D6DTl2m.gif" width="640">
</p>
<br/>

## What is @pika/pack?

Authoring JavaScript in 2013 was simple: Write JavaScript and hit `npm publish`.

6 years later and things are more complicated: Modern JavaScript (and TypeScript, and Flow, and Reason, and...) no longer runs everywhere. Today, the best libraries ship legacy code for Node.js alongside modern code for web bundlers, type definition files for TypeScript/VSCode and bundled code for UNPKG (if applicable). 

Of course it's up to you as the author to figure all of this out on your own, with almost no direct feedback or guidance. I hope you have your PhD in Bundler Configuration handy!

**@pika/pack approaches the problem differently:** 

- **Use simple, pluggable builders to build your package.**
- Each builder compiles your modern code for a single environment (like Node.js, ESM, UNPKG, Deno). 
- Each builder configures your `package.json` entrypoints (like `"main"` and `"module"`) automatically.
- Most builders require zero configuration to run.

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
      // 1. Compile your source to standard ES2018+
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
      // 2. Create a distribution to run on Node.js
      ["@pika/node-builder"],
      // 3. Create a distribution to run on web browsers (optimized for bundlers)
      ["@pika/web-builder"],
      // 4. Generate type definitions automatically from your JavaScript
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
