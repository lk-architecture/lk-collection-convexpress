import {Kinesis} from "aws-sdk";
import {promisify} from "bluebird";

const kinesis = new Kinesis({
    apiVersion: "2013-12-02"
});
const _putRecord = promisify(::kinesis.putRecord);

export async function putRecord (req, event) {
    await _putRecord({
        Data: JSON.stringify(event),
        PartitionKey: `${req.collection}-${event.data.id}`,
        StreamName: req.kinesisStream
    });
    req.log.info({event}, `Event put into kinesis stream ${req.kinesisStream}`);
}
