const errorModel = () => ({
    type: "object",
    properties: {
        message: {
            type: "string"
        }
    }
});

const created = () => ({
    "201": {
        description: "Element created successfully, returns its id",
        schema: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                }
            }
        }
    }
});
const noContent = () => ({
    "204": {
        description: "Operation executed successfully, returns nothing"
    }
});
const notFound = () => ({
    "404": {
        description: "No element found with the provided id",
        schema: errorModel()
    }
});
const conflict = () => ({
    "409": {
        description: "An element by the same id already exists",
        schema: errorModel()
    }
});
const unauthorized = () => ({
    "401": {
        description: "Unauthorized to perform the operation",
        schema: errorModel()
    }
});
const internalServerError = () => ({
    "500": {
        description: "Unexpected internal server error",
        schema: errorModel()
    }
});

export function insert (name, schema) {
    return {
        [`/${name}`]: {
            post: {
                description: `Insert an element into collection ${name}`,
                parameters: [{
                    name: "body",
                    in: "body",
                    description: "Element to insert",
                    required: true,
                    schema
                }],
                responses: {
                    ...created(),
                    ...conflict(),
                    ...unauthorized(),
                    ...internalServerError()
                }
            }
        }
    };
}

export function replace (name, schema) {
    return {
        [`/${name}/{id}`]: {
            put: {
                description: `Replace an element in collection ${name}`,
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "The id of the element that needs to be replaced",
                        required: true,
                        type: "string"
                    },
                    {
                        name: "body",
                        in: "body",
                        description: "Replacement for the existing element",
                        required: true,
                        schema
                    }
                ],
                responses: {
                    ...noContent(),
                    ...notFound(),
                    ...unauthorized(),
                    ...internalServerError()
                }
            }
        }
    };
}

export function remove (name) {
    return {
        [`/${name}/{id}`]: {
            delete: {
                description: `Remove an element from collection ${name}`,
                parameters: [{
                    name: "id",
                    in: "path",
                    description: "The id of the element that needs to be removed",
                    required: true,
                    type: "string"
                }],
                responses: {
                    ...noContent(),
                    ...notFound(),
                    ...unauthorized(),
                    ...internalServerError()
                }
            }
        }
    };
}
