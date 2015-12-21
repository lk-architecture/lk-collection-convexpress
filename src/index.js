import {Router} from "express";
import merge from "lodash.merge";

import * as swaggerPaths from "./swagger-paths";
import * as handlers from "./handlers";
import * as middleware from "./middleware";

function getRouter (options) {
    const {
        authorize,
        findElement,
        kinesisStream,
        name,
        schema
    } = options;
    return Router()
        .use(middleware.validate(schema))
        .use(middleware.decorateWithCollection(name))
        .use(middleware.decorateWithKinesisStream(kinesisStream))
        .use(middleware.decorateWithExistingElement(findElement))
        .use(middleware.authorize(authorize))
        .use(middleware.conflict())
        .use(middleware.notFound())
        .post(`/${name}`, handlers.insert)
        .put(`/${name}/:id`, handlers.replace)
        .delete(`/${name}/:id`, handlers.remove);
}

function getSwaggerPaths ({authorize, name, schema}) {
    const paths = {};
    if (authorize.insert) {
        merge(paths, swaggerPaths.insert(name, schema));
    }
    if (authorize.replace) {
        merge(paths, swaggerPaths.replace(name, schema));
    }
    if (authorize.remove) {
        merge(paths, swaggerPaths.remove(name));
    }
    return paths;
}

export default function collection (options) {
    return {
        router: getRouter(options),
        swaggerPaths: getSwaggerPaths(options)
    };
}
