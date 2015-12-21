import {v4} from "node-uuid";

import {putRecord} from "./kinesis";
import getSource from "./get-source";

export default async function remove (req, res) {
    const {collection, elementId} = req;
    const id = elementId;
    await putRecord(req, {
        id: v4(),
        data: {id},
        source: getSource(req),
        timestamp: new Date().toISOString(),
        type: `element removed in collection ${collection}`
    });
    res.status(204).send();
}
