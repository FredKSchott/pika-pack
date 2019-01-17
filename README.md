<p align="center">
  <img alt="Yarn" src="https://i.imgur.com/bUYlxms.png?1" width="420" style="float: left">
</p>

```
npm install @pika/pack
```

<p align="center">
  <strong>@pika/pack</strong> • Package publishing made painless!
</p>

## tl;dr

- Authoring packages in 2013 was simple: Write JavaScript and hit `npm publish`.
- Authoring packages in 2019 is more complicated: The JavaScript (or TypeScript) that we write has evolved, but the code we ship has to be transpiled down to run directly in Node.js. At the same time, web consumers are asking for modern ESM code that works best in their bundlers for treeshaking, smaller files and faster load times.
- This problem is only getting more complex as we add support for more languages (via [WASM](https://webassembly.org/)) and more environments (like [Deno](https://deno.land)). 

**@pika/pack is a new, holistic approach to package publishing that replaces complex tooling configurations with simple, pluggable builders.**

![build screenshot](https://imgur.com/klnYVMA.png)


## Quickstart

1. `npm install --global @pika/pack`
1. Add a `"distributions"` config to your `package.json` manifest, similar to the one in the screenshot above:

        "distributions": {
          "src": [true],
          "plugins": [
            ["@pika/node-builder"],
            ["@pika/web-builder"]
          ]
        },

1. In the same file, remove any unneccesary entrypoints from your `package.json`. Pika will configure these for your published package automatically.
1. Make sure that all referenced builders are installed as dev dependencies in your package:

       npm install --save-dev @pika/node-builder @pika/web-builder

1. Make sure your package follows the standard package format:  
    a. All source files in `src/`  
    a. Any non-source assets in `assets/`  
    c. Your library entrypoint at `src/index.js` (or equivilant file extension)
1. Run `pika build`! Your new `pkg/` build directory will be created with all distributions and a well-configured `package.json` manifest, ready to run locally or publish to npm.

        pkg/                
        ├── dist-src/        
        │  └── index.js       // "esnext": Default build
        ├── dist-node/
        │  ├── index.js       // "main": Built by @pika/node-builder
        │  └── index.bin.js   // "bin": Built by @pika/simple-bin (if used)
        ├── dist-web/
        │  └── index.js       // "module": Built by @pika/web-builder
        ├── dist-types/
        │  └── index.d.ts     // "types": Built by @pika/types-builder (if used)
        ├── package.json
        └── README.md

1. When you're ready, run `pika publish` to re-build and then publish your `pkg/` to npm!

[See a full collection of example projects here →](https://github.com/pikapkg/examples)


## Available Builders

#### Source Builders:
- `@pika/src-builder`: Compiles JavaScript/TypeScript to ES2018.
- `@pika/assemblyscript-builder`: Builds WASM from TypeScript.
- `@pika/bucklescript-builder`: Builds WASM from ReasonML/OCAML.
- `@pika/simple-wasm-wrapper`: Builds simple JS bindings for any WASM build.

#### Dist Builders:
- `@pika/node-builder`: Builds a distribution that runs on Node LTS (v6+).
- `@pika/web-builder`: Builds an ESM distribution optimized for browsers & bundlers.
- `@pika/types-builder`: Builds TypeScript definitions from your TS, or automatically generate them from your JS.
- `@pika/deno-builder`: Builds a distribution that runs on Deno.

#### Advanced Builders:
- `@pika/node-bundler`: Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
- `@pika/web-bundler`: Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving directly to browsers.
- `@pika/simple-bin`: Generates & configures a bin entrypoint file to run your library.

*Write your own!* @pika/pack can load local builders by relative path directly from your repo.  
*Publish & Share your own!* These official builders are just the start.  
[See a full list of official builders here →](https://github.com/pikapkg/builders/tree/master/packages)


## pika build

![build screenshot](https://imgur.com/Q5WhB62.png)

## pika publish

Based on the popular [`np`](https://github.com/sindresorhus/np) package! Validates your directory before running you through the publish process step-by-step to publish your `pkg/` sub-directory package.
![publish screenshot](https://imgur.com/SPjSRGN.png)
