import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import * as kinesis from "handlers/kinesis";

describe("putRecord function", () => {

    const _putRecord = sinon.stub().returns(Promise.resolve());

    beforeEach(() => {
        kinesis.__Rewire__("_putRecord", _putRecord);
    });

    afterEach(() => {
        kinesis.__ResetDependency__("_putRecord");
    });

    it("calls `kinesis.putRecord` with the correct parameters", () => {
        const req = {
            body: {},
            collection: "readings",
            elementId: "elementId",
            kinesisStream: "kinesisStream",
            log: {
                info: sinon.spy()
            }
        };
        const event = {
            id: "id",
            data: {
                id: "elementId",
                element: "element"
            },
            timestamp: new Date().toISOString(),
            type: `element inserted in collection readings`
        };
        return kinesis.putRecord(req, event)
            .then(() => {
                expect(_putRecord).to.have.callCount(1);
                expect(_putRecord.getCall(0).args[0]).to.deep.equal({
                    Data: JSON.stringify(event),
                    PartitionKey: "readings-elementId",
                    StreamName: "kinesisStream"
                });
            });
    });

});
