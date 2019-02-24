# Contributing to @pika/pack

All contributions are welcome! 

## Building the Project

It is very cool being able to use @pika/pack to build @pika/pack. Unfortunately, npm doesn't make it easy to install a package as a dependency of itself. So to get around this, we keep a `checkpoint/` folder in the project which is a checkpoint build of a working @pika/pack. We then use this to build our package in development.

```
git clone https://github.com/pikapkg/pack.git
npm install
npm run build
```

## Testing the Project

Writing unit tests for the project is still TODO. I know, I know, I'm more embarassed than anyone. 

The good news is that we have several example projects, including @pika/pack itself. First I'd like to get Travis running builds of all of our example projects with the PR'd version of @pika/pack. Until then, our only automated test is to use @pika/pack to build @pika/pack.

```
npm t
```
