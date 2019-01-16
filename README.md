<p align="center">
  <img alt="Yarn" src="https://i.imgur.com/bUYlxms.png?1" width="420" style="float: left">
</p>


<p align="center">
  <strong>@pika/pack</strong> • Package publishing made painless!
</p>

## tl;dr

```
npm install @pika/pack
```

- Authoring good packages in 2013 was simple: Write JavaScript and hit `npm publish`.
- Authoring good packages in 2019 is more complicated: The JavaScript (and TypeScript!) that we write has evolved, but the code that we ship must still be transpiled down to run directly in Node.js. At the same time, web consumers are asking for modern ESM code that works best in their bundlers for treeshaking, smaller files and faster load times.
- This is only getting more complex as we add support for more languages (like Rust & ReasonML via WASM) and more environments (like Deno). 
- **@pika/pack is an evolved, holistic approach to package building that replaces complex manual configuration with simple, pluggable package builders.**

![build screenshot](https://imgur.com/klnYVMA.png)


## Getting Started

1. `npm install --global @pika/pack`
1. Add a "distributions" config to your `package.json` manifest, similar to the one in the screenshot above. 
1. Remove any unneccesary entrypoints from your `package.json` as well. These will be automatically configured for you going forward.
1. Make sure you have all referenced builders installed as dev dependencies in your package.
1. Make sure your package follows the standard format:  
    a. All source files in `src/`  
    b. Your library entrypoint at `src/index.xx`
1. Run `pika build`!
1. See your new `pkg/` build directory containing all distributions and a well-configured `package.json` manifest, ready to run and ready to publish.
1. When you're ready, run `pika publish` to re-build and then publish your `pkg/` to npm!

[See a full list of example projects here →](https://github.com/pikapkg/examples)


## Available Builders

#### Source Builders:
- `@pika/src-builder`: Compiles JavaScript/TypeScript to ES2018.
- `@pika/assemblyscript-builder`: Builds WASM from TypeScript.
- `@pika/bucklescript-builder`: Builds WASM from ReasonML/OCAML.
- `@pika/simple-wasm-wrapper`: Builds simple JS bindings for a WASM build.

#### Dist Builders:
- `@pika/node-builder`: Builds a distribution that runs on Node LTS (v6+).
- `@pika/web-builder`: Builds an ESM distribution optimized for browsers & bundlers.
- `@pika/types-builder`: Builds TypeScript definitions from your TS, or automatically generate them from your JS.
- `@pika/deno-builder`: Builds a distribution that runs on Deno.

#### Advanced Builders:
- `@pika/node-bundler`: Creates a Node.js build with all code (including dependencies) bundled into a single file. Useful for CLIs.
- `@pika/web-bundler`: Creates a ESM build with all code (including dependencies) bundled. Useful for unpkg & serving directly to browsers.
- `@pika/simple-bin`: Generates & configures a bin entrypoint file to run your library.

[See a full list of official builders here →](https://github.com/pikapkg/builders/tree/master/packages)


## pika build

![build screenshot](https://imgur.com/Q5WhB62.png)

## pika publish

Based on the popular [`np`](https://github.com/sindresorhus/np) package! Validates your directory before running you through the publish process step-by-step to publish your `pkg/` sub-directory package.
![publish screenshot](https://imgur.com/SPjSRGN.png)
