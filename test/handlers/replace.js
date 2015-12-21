import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import replace from "handlers/replace";

describe("replace", () => {

    const putRecord = sinon.stub().returns(Promise.resolve());
    const v4 = () => "id";
    var clock;

    beforeEach(() => {
        putRecord.reset();
        replace.__Rewire__("putRecord", putRecord);
        replace.__Rewire__("v4", v4);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        replace.__ResetDependency__("putRecord");
        replace.__ResetDependency__("v4");
        clock.restore();
    });

    it("should call `putRecord` function with correct parameters", () => {
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
        return replace(req, res)
            .then(() => {
                expect(putRecord).to.have.callCount(1);
                expect(putRecord.getCall(0).args[0]).to.equal(req);
                expect(putRecord.getCall(0).args[1]).to.deep.equal({
                    id: "id",
                    data: {
                        id: "elementId",
                        element: {}
                    },
                    timestamp: "1970-01-01T00:00:00.000Z",
                    type: "element replaced in collection readings"
                });
            });
    });

    it("should call `status` function in `res` with 201", () => {
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
        return replace(req, res)
            .then(() => {
                expect(res.status).to.have.callCount(1);
                expect(res.status).to.have.been.calledWith(204);
            });
    });

    it("should call `send` function in `res`", () => {
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
        return replace(req, res)
            .then(() => {
                expect(res.send).to.have.callCount(1);
                expect(res.send).to.have.been.calledWith();
            });
    });

});
