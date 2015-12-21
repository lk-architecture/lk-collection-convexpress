import {v4} from "node-uuid";

import {putRecord} from "./kinesis";

export default async function insert (req, res) {
    const {body, collection, elementId} = req;
    const element = body;
    const id = elementId || v4();
    delete element.id;
    await putRecord(req, {
        id: v4(),
        data: {id, element},
        timestamp: new Date().toISOString(),
        type: `element inserted in collection ${collection}`
    });
    res.status(201).send({id});
}
