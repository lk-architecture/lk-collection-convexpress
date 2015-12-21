import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import * as kinesis from "handlers/kinesis";

describe("putRecord", () => {

    const _putRecord = sinon.stub().returns(Promise.resolve());
    var clock;

    beforeEach(() => {
        kinesis.__Rewire__("_putRecord", _putRecord);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        kinesis.__ResetDependency__("_putRecord");
        clock.restore();
    });

    it("should call the `putRecord` function of `kinesis` with the correct parameter", () => {
        const event = {
            id: "id",
            data: {
                id: "id",
                element: "element"
            },
            timestamp: new Date().toISOString(),
            type: `element inserted in collection readings`
        };
        const req = {
            body: {},
            collection: "readings",
            elementId: "elementId",
            kinesisStream: "kinesisStream",
            log: {
                info: sinon.spy()
            }
        };
        return kinesis.putRecord(req, event)
            .then(() => {
                expect(_putRecord).to.have.callCount(1);
                expect(_putRecord.getCall(0).args[0]).to.deep.equal({
                    Data: JSON.stringify(event),
                    PartitionKey: "readings",
                    StreamName: "kinesisStream"
                });
            });
    });

    it("should call the `info` function of `req.log` with the correct parameter", () => {
        const event = {
            id: "id",
            data: {
                id: "id",
                element: "element"
            },
            timestamp: new Date().toISOString(),
            type: `element inserted in collection readings`
        };
        const req = {
            body: {},
            collection: "readings",
            elementId: "elementId",
            kinesisStream: "kinesisStream",
            log: {
                info: sinon.spy()
            }
        };
        return kinesis.putRecord(req, event)
            .then(() => {
                expect(req.log.info).to.have.callCount(1);
                expect(req.log.info).to.have.been.calledWith(
                    {event},
                    "Event put into kinesis stream kinesisStream"
                );
            });
    });

});
