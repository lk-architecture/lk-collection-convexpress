import {v4} from "node-uuid";

import {putRecord} from "./kinesis";
import getSource from "./get-source";

export default async function replace (req, res) {
    const {body, collection, elementId} = req;
    const element = body;
    const id = elementId;
    delete element.id;
    await putRecord(req, {
        id: v4(),
        data: {id, element},
        source: getSource(req),
        timestamp: new Date().toISOString(),
        type: `element replaced in collection ${collection}`
    });
    res.status(204).send();
}
