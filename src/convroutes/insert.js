import omit from "lodash.omit";
import {v4} from "node-uuid";

import * as authorize from "../middleware/authorize";
import * as conflict from "../middleware/conflict";

export default function getConvroute (options) {
    const {
        name,
        schema,
        dispatchEvent
    } = options;
    return {
        path: `/${name}`,
        method: "post",
        description: `Inserts an element into collection ${name}`,
        parameters: [{
            name: "element",
            in: "body",
            required: true,
            schema: schema
        }],
        responses: {
            ...conflict.responses,
            ...authorize.responses,
            "201": {
                description: "Element created"
            }
        },
        middleware: [
            conflict.getMiddleware(options),
            authorize.getMiddleware(options)
        ],
        handler: async (req, res) => {
            const eventType = `element inserted in collection ${name}`;
            const eventData = {
                id: req.body.id || v4(),
                element: omit(req.body, "id")
            };
            const eventOptions = {
                sourceUserId: req.userId,
                partitionKey: `${name}-${eventData.id}`
            };
            await dispatchEvent(eventType, eventData, eventOptions);
            res.status(201).send({id: eventData.id});
        }
    };
}
