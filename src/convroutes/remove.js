import * as authorize from "../middleware/authorize";
import * as notFound from "../middleware/not-found";

export default function getConvroute (options) {
    const {
        name,
        dispatchEvent
    } = options;
    return {
        path: `/${name}/:elementId`,
        method: "delete",
        description: `Delete an element from collection ${name}`,
        parameters: [{
            name: "elementId",
            in: "path",
            required: true
        }],
        responses: {
            ...notFound.responses,
            ...authorize.responses,
            "204": {
                description: "Element removed"
            }
        },
        middleware: [
            notFound.getMiddleware(options),
            authorize.getMiddleware(options)
        ],
        handler: async (req, res) => {
            const eventType = `element removed in collection ${name}`;
            const eventData = {id: req.params.elementId};
            const eventOptions = {
                sourceUserId: req.userId,
                partitionKey: `${name}-${eventData.id}`
            };
            await dispatchEvent(eventType, eventData, eventOptions);
            res.status(204).send();
        }
    };
}
