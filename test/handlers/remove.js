import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import remove from "handlers/remove";

describe("remove handler", () => {

    const putRecord = sinon.stub().returns(Promise.resolve());
    const v4 = () => "id";
    var clock;

    beforeEach(() => {
        putRecord.reset();
        remove.__Rewire__("putRecord", putRecord);
        remove.__Rewire__("v4", v4);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        remove.__ResetDependency__("putRecord");
        remove.__ResetDependency__("v4");
        clock.restore();
    });

    it("calls `putRecord` with the correct parameters", () => {
        const req = {
            user: {
                _id: "userId"
            },
            collection: "readings",
            elementId: "elementId",
            producerId: "producerId"
        };
        const res = {
            status: sinon.spy(() => res),
            send: sinon.spy()
        };
        return remove(req, res)
            .then(() => {
                expect(putRecord).to.have.callCount(1);
                expect(putRecord.getCall(0).args[0]).to.equal(req);
                expect(putRecord.getCall(0).args[1]).to.deep.equal({
                    id: "id",
                    data: {
                        id: "elementId"
                    },
                    source: {
                        userId: "userId",
                        producerId: "producerId"
                    },
                    timestamp: "1970-01-01T00:00:00.000Z",
                    type: "element removed in collection readings"
                });
            });
    });

    it("sends a 204 response to the client with an empty body", () => {
        const req = {
            body: {
                id: "elementId"
            },
            collection: "readings",
            elementId: "elementId"
        };
        const res = {
            status: sinon.spy(() => res),
            send: sinon.spy()
        };
        return remove(req, res)
            .then(() => {
                expect(res.status).to.have.callCount(1);
                expect(res.status).to.have.been.calledWith(204);
                expect(res.send).to.have.callCount(1);
                expect(res.send.getCall(0).args.length).to.equal(0);
            });
    });

});
