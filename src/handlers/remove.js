import {v4} from "node-uuid";

import {putRecord} from "./kinesis";

export default async function remove (req, res) {
    const {collection, elementId} = req;
    const id = elementId;
    await putRecord(req, {
        id: v4(),
        data: {id},
        timestamp: new Date().toISOString(),
        type: `element removed in collection ${collection}`
    });
    res.status(204).send();
}
