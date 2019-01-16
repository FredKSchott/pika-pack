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

- Authoring good packages in 2013 was simple: Write JavaScript and `npm publish`
- Authoring good packages in 2019 is more complicated: The JavaScript that we write has evolved, but the code that we ship must still be transpiled down to run directly in Node.js. At the same time, web consumers are asking for modern ESM code that works best in their bundlers for treeshaking and faster page load times.
- This is only getting more complex as we add support for more languages (like Rust & ReasonML via WASM) and more environments (like Deno). 
- **@pika/pack is an evolved, holistic approach to package building that replaces complex manual configuration with simple, pluggable package builders.**

![build screenshot](https://imgur.com/klnYVMA.png)


## pika build

![build screenshot](https://imgur.com/Q5WhB62.png)

## pika publish
![publish screenshot](https://imgur.com/SPjSRGN.png)
