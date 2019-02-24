<p align="center">
  <img alt="Logo" src="https://next.pikapkg.com/static/img/new-logo1.png" width="280">
</p>

<p align="center">
  <strong>@pika/pack</strong> • npm package building, reimagined.
</p>

<p align="center">
  <img alt="Demo" src="https://next.pikapkg.com/static/img/pack-build-demo.gif?" width="720">
</p>


## @pika/pack helps you build amazing packages without the hassle:

- **Simple** &nbsp;⚡️&nbsp; Use pre-configured plugins to build your package for you.
- **Flexible** &nbsp;🏋️‍♀️&nbsp; Choose plugins and optimizations to match your needs.
- **Holistic** &nbsp;⚛️&nbsp; Let us build the entire package... *including package.json.*


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

### 😎 🆒

So now what? If you run `pack build` with an empty pipeline, you'll get an empty package build. **@pika/pack** lets you connect pre-configured plugins to build and optimize your package for you. Plugins wrap already-popular tools like Babel and Rollup with npm-optimized config options, removing the need to fiddle with much (if any) configuration yourself. You even get a generated package.json manifest configured for you ***automatically***.

### 1. Create a project pipeline out of simple, pluggable builders.

```js
// Before: Your top-level package.json manifest:
{
  "name": "simple-package",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/*"]}],
      ["@pika/plugin-build-node"],
      ["@pika/plugin-build-web"],
      ["@pika/plugin-build-types"]
    ]
  }
}
```

Builders are simple, single-purpose build plugins defined in your `package.json`. For example, `@pika/plugin-build-node` & `@pika/plugin-build-web` build your package for those different environments. Other, more interesting builders can bundle your web build for [unpkg](https://unpkg.com), generate TypeScript definitions from your JavaScript, addon a standard CLI wrapper for Node.js builds, and even compile non-JS languages to WASM (with JS bindings added).

### 2. Builders handle everything, including package configuration.

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

This is all possible because **@pika/pack** builds your entire package: code, assets, and even package.json manifest. By building the entire package, you end up with a fully-built `pkg/` directory, ready to publish. Entry points like "main", "module", "umd:main", "types", "unpkg", "files", and even advanced options like "sideEffects" are all handled by your build pipeline.


## Available Builders

#### Source Builders:

> **NOTE: Include a source builder early in your pipeline.** Source builders take your modern source code (ESNext, TS, etc.) and compile it to standard, ES2018 JavaScript. Other builders will then use this standardized build to base their own work off of.

 - [`@pika/plugin-standard-pkg`](https://github.com/pikapkg/builders/tree/master/packages/plugin-standard-pkg/): Compiles JavaScript/TypeScript to ES2018. Supports personalized, top-level `.babelrc` plugins/config.
 - [`@pika/plugin-ts-standard-pkg`](https://github.com/pikapkg/builders/tree/master/packages/plugin-ts-standard-pkg/): Compiles TypeScript to ES2018 (Uses `tsc` internally instead of Babel, and builds type definitions automatically).
 - [`@pika/plugin-source-bucklescript`](https://github.com/pikapkg/builders/tree/master/packages/plugin-source-bucklescript/): Builds ES2018 JavaScript from ReasonML or OCaml via [BuckleScript](https://bucklescript.github.io).

#### Distribution Builders:

 - [`@pika/plugin-build-deno`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-deno/): Builds a distribution that runs on Deno (TS projects only).
 - [`@pika/plugin-build-node`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-node/): Builds a distribution that runs on Node LTS (v6+).
 - [`@pika/plugin-build-types`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-types/): Builds TypeScript definitions from your TS, or automatically generate them from your JS. Not required if you use `@pika/plugin-ts-standard-pkg`.
 - [`@pika/plugin-build-web`](https://github.com/pikapkg/builders/tree/master/packages/plugin-build-web/): Builds an ESM distribution optimized for browsers & bundlers.

#### WASM Builders:
 - [`@pika/plugin-wasm-assemblyscript`](https://github.com/pikapkg/builders/tree/master/packages/plugin-wasm-assemblyscript/): Builds WASM from TypeScript using [AssemblyScript](https://github.com/AssemblyScript/assemblyscript).
 - [`@pika/plugin-wasm-emscripten`](https://github.com/pikapkg/issues/1): Builds WASM from C/C++ using [Emscripten](https://github.com/emscripten-core/emscripten) (Coming Soon).
 - [`@pika/plugin-wasm-bindings`](https://github.com/pikapkg/builders/tree/master/packages/plugin-wasm-bindings/): Builds a simple JS wrapper for any WASM build.

#### Advanced Builders:
 - [`@pika/plugin-bundle-node`](https://github.com/pikapkg/builders/tree/master/packages/plugin-bundle-node/): Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
 - [`@pika/plugin-bundle-web`](https://github.com/pikapkg/builders/tree/master/packages/plugin-bundle-web/): Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving code directly to browsers.
 - [`@pika/plugin-simple-bin`](https://github.com/pikapkg/builders/tree/master/packages/plugin-simple-bin/):  Generates & configures a CLI wrapper to run your library from the command line.
- **Write your own!** @pika/pack can load local builders by relative path directly from your repo.
- **Publish & Share your own!** These official builders are just the start. Create a PR to add your community plugin to this list.

[See a full list of official builders here →](https://github.com/pikapkg/builders/tree/master/packages)

#### Community Builders

- [`@ryaninvents/plugin-bundle-zip-node`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-zip-node): Plugin for @pika/pack to zip built files for Node.js.
- [`@ryaninvents/plugin-bundle-dependencies`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-dependencies): Plugin for @pika/pack to zip your package's dependencies.
- [`@ryaninvents/plugin-bundle-nextjs`](https://www.npmjs.com/package/@ryaninvents/plugin-bundle-nextjs): Plugin for @pika/pack to package a Next.js app for AWS Lambda.
- [`pika-plugin-minify`](https://www.npmjs.com/package/pika-plugin-minify): A @pika/pack build plugin. Minifies your index.js files in /pkg/* using terser.


## Bonus Command: `publish`

<p align="center" style="margin-bottom: 0rem;">
  <img alt="Demo" src="https://next.pikapkg.com/static/img/publish-demo.gif" width="720">
</p>

We've brought our favorite parts of [np](https://github.com/sindresorhus/np) (a self-described "better npm publish") into **@pika/pack**. With the `publish` command there's no need to worry about how to publish your package once you've built it.

Run `pack publish` in your project and **@pika/pack** will walk you through version bumping, tagging your release, generating a fresh build, and finally publishing your package.
