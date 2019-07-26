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
      ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/**/*"]}],
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


## Build Plugins

**[Check out the full list](https://github.com/pikapkg/builders)** of official & community-written @pika/pack plugins!


## Lerna Support

Curious about integrating @pika/pack with Lerna? Our official collection of plugins is a Lerna repo that uses @pika/pack to build each package! [Check it out](https://github.com/pikapkg/builders) to see how easy it is to use the two tools together.
