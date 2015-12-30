[![npm version](https://badge.fury.io/js/lk-collection-convexpress.svg)](https://badge.fury.io/js/lk-collection-convexpress)
[![Build Status](https://travis-ci.org/lk-architecture/lk-collection-convexpress.svg?branch=master)](https://travis-ci.org/lk-architecture/lk-collection-convexpress)
[![codecov.io](https://codecov.io/github/lk-architecture/lk-collection-convexpress/coverage.svg?branch=master)](https://codecov.io/github/lk-architecture/lk-collection-convexpress?branch=master)
[![Dependency Status](https://david-dm.org/lk-architecture/lk-collection-convexpress.svg)](https://david-dm.org/lk-architecture/lk-collection-convexpress)
[![devDependency Status](https://david-dm.org/lk-architecture/lk-collection-convexpress/dev-status.svg)](https://david-dm.org/lk-architecture/lk-collection-convexpress#info=devDependencies)

# lk-collection-convexpress

Convexpress routes implementing collections in the lk-architecture.

## Usage

```js
import express from "express";
import convexpress from "convexpress";
import collection from "lk-collection-convexpress";
import getDispatch from "lk-dispatch";

const posts = collection({
    name: "posts",
    schema: {
        type: "object",
        properties: {/* ... */}
    },
    authorize: {
        insert: () => ({authorized: true}),
        replace: () => ({authorized: true}),
        remove: () => ({authorized: true})
    },
    dispatchEvent: getDispatch(/* ... */),
    findElement: () => ({}),
});

const convrouter = convexpress({/* ... */})
    .serveSwagger()
    .convroute(posts.insert)
    .convroute(posts.replace)
    .convroute(posts.remove);

express()
    .use(convrouter)
    .listen(3000);
```
