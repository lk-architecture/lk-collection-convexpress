import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import insert from "handlers/insert";

describe("insert handler", () => {

    const putRecord = sinon.stub().returns(Promise.resolve());
    const v4 = () => "id";
    var clock;

    beforeEach(() => {
        putRecord.reset();
        insert.__Rewire__("putRecord", putRecord);
        insert.__Rewire__("v4", v4);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        insert.__ResetDependency__("putRecord");
        insert.__ResetDependency__("v4");
        clock.restore();
    });

    it("calls `putRecord` with the correct parameters [CASE: `req.elementId` defined]", () => {
        const req = {
            body: {
                id: "elementId"
            },
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
        return insert(req, res)
            .then(() => {
                expect(putRecord).to.have.callCount(1);
                expect(putRecord.getCall(0).args[0]).to.equal(req);
                expect(putRecord.getCall(0).args[1]).to.deep.equal({
                    id: "id",
                    data: {
                        id: "elementId",
                        element: {}
                    },
                    source: {
                        userId: "userId",
                        producerId: "producerId"
                    },
                    timestamp: "1970-01-01T00:00:00.000Z",
                    type: "element inserted in collection readings"
                });
            });
    });

    it("calls `putRecord` with the correct parameters [CASE: `req.elementId` not defined]", () => {
        const req = {
            body: {
                id: "elementId"
            },
            user: {
                _id: "userId"
            },
            collection: "readings",
            producerId: "producerId"
        };
        const res = {
            status: sinon.spy(() => res),
            send: sinon.spy()
        };
        return insert(req, res)
            .then(() => {
                expect(putRecord).to.have.callCount(1);
                expect(putRecord.getCall(0).args[0]).to.equal(req);
                expect(putRecord.getCall(0).args[1]).to.deep.equal({
                    id: "id",
                    data: {
                        id: "id",
                        element: {}
                    },
                    source: {
                        userId: "userId",
                        producerId: "producerId"
                    },
                    timestamp: "1970-01-01T00:00:00.000Z",
                    type: "element inserted in collection readings"
                });
            });
    });

    it("sends a 201 response to the client with the id of the inserted element in the body", () => {
        const req = {
            body: {
                id: "elementId"
            },
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
        return insert(req, res)
            .then(() => {
                expect(res.status).to.have.callCount(1);
                expect(res.status).to.have.been.calledWith(201);
                expect(res.send).to.have.callCount(1);
                expect(res.send).to.have.been.calledWith({id: "elementId"});
            });
    });

});
