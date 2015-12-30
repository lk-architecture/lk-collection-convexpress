import chai, {expect} from "chai";
import convexpress from "convexpress";
import express from "express";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import request from "supertest-as-promised";

chai.use(sinonChai);

import getInsert from "../../src/convroutes/insert";

describe("insert convroute", () => {

    function getServer (options, middleware) {
        const router = convexpress({}).convroute(getInsert({
            name: "collection-name",
            schema: {
                type: "object",
                properties: {
                    key: {
                        type: "string"
                    }
                },
                required: ["key"]
            },
            authorize: {
                insert: () => ({
                    authorized: true
                })
            },
            dispatchEvent: () => null,
            findElement: () => null,
            ...options
        }));
        const server = express();
        if (middleware) {
            server.use(middleware);
        }
        server.use(router);
        return server;
    }

    beforeEach(() => {
        getInsert.__Rewire__("v4", () => "uuid");
    });
    afterEach(() => {
        getInsert.__ResetDependency__("v4");
    });

    it("400 on element not matching schema [CASE: no body]", () => {
        return request(getServer())
            .post("/collection-name")
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on element not matching schema [CASE: missing property]", () => {
        return request(getServer())
            .post("/collection-name")
            .send({anotherKey: "value"})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on element not matching schema [CASE: invalid property]", () => {
        return request(getServer())
            .post("/collection-name")
            .send({key: 5})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("409 on conflict", () => {
        const options = {
            findElement: sinon.stub().returns({})
        };
        return request(getServer(options))
            .post("/collection-name")
            .send({id: "elementId", key: "value"})
            .expect(409)
            .expect({
                message: "Element with id elementId already exists"
            })
            .then(() => {
                expect(options.findElement).to.have.been.calledWith("collection-name", "elementId");
            });
    });

    it("403 on authorization fail", () => {
        const options = {
            authorize: {
                insert: () => ({
                    authorized: false,
                    reason: "Reason message"
                })
            }
        };
        return request(getServer(options))
            .post("/collection-name")
            .send({key: "value"})
            .expect(403)
            .expect({
                message: "Reason message"
            });
    });

    it("201 on no errors [CASE: element id provided]", () => {
        return request(getServer())
            .post("/collection-name")
            .send({id: "elementId", key: "value"})
            .expect(201)
            .expect({id: "elementId"});
    });

    it("201 on no errors [CASE: element id not provided]", () => {
        return request(getServer())
            .post("/collection-name")
            .send({key: "value"})
            .expect(201)
            .expect({id: "uuid"});
    });

    it("dispatches an `inserted` event [CASE: element id provided]", () => {
        const options = {
            dispatchEvent: sinon.spy()
        };
        const middleware = (req, res, next) => {
            req.userId = "userId";
            next();
        };
        return request(getServer(options, middleware))
            .post("/collection-name")
            .send({id: "elementId", key: "value"})
            .expect(201)
            .then(() => {
                expect(options.dispatchEvent).to.have.been.calledWith(
                    "element inserted in collection collection-name",
                    {
                        id: "elementId",
                        element: {key: "value"}
                    },
                    {
                        sourceUserId: "userId",
                        partitionKey: "collection-name-elementId"
                    }
                );
            });
    });

    it("dispatches an `inserted` event [CASE: element id not provided]", () => {
        const options = {
            dispatchEvent: sinon.spy()
        };
        const middleware = (req, res, next) => {
            req.userId = "userId";
            next();
        };
        return request(getServer(options, middleware))
            .post("/collection-name")
            .send({key: "value"})
            .expect(201)
            .then(() => {
                expect(options.dispatchEvent).to.have.been.calledWith(
                    "element inserted in collection collection-name",
                    {
                        id: "uuid",
                        element: {key: "value"}
                    },
                    {
                        sourceUserId: "userId",
                        partitionKey: "collection-name-uuid"
                    }
                );
            });
    });

});
