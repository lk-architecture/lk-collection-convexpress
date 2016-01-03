import omit from "lodash.omit";

import * as authorize from "../middleware/authorize";
import * as notFound from "../middleware/not-found";

export default function getConvroute (options) {
    const {
        name,
        schema,
        dispatchEvent
    } = options;
    return {
        path: `/${name}/:elementId`,
        method: "put",
        description: `Replace an element in collection ${name}`,
        tags: [name],
        parameters: [
            {
                name: "elementId",
                in: "path",
                required: true
            },
            {
                name: "element",
                in: "body",
                required: true,
                schema: schema
            }
        ],
        responses: {
            ...notFound.responses,
            ...authorize.responses,
            "204": {
                description: "Element replaced"
            }
        },
        middleware: [
            notFound.getMiddleware(options),
            authorize.getMiddleware(options)
        ],
        handler: async (req, res) => {
            const eventType = `element replaced in collection ${name}`;
            const eventData = {
                id: req.params.elementId,
                element: omit(req.body, "id")
            };
            const eventOptions = {
                sourceUserId: req.userId,
                partitionKey: `${name}-${eventData.id}`
            };
            await dispatchEvent(eventType, eventData, eventOptions);
            res.status(204).send();
        }
    };
}
