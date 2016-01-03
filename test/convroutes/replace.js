import chai, {expect} from "chai";
import convexpress from "convexpress";
import express from "express";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import request from "supertest-as-promised";

chai.use(sinonChai);

import getReplace from "../../src/convroutes/replace";

describe("replace convroute", () => {

    function getServer (options, middleware) {
        const router = convexpress({}).convroute(getReplace({
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
                replace: () => ({
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

    it("400 on element not matching schema [CASE: no body]", () => {
        return request(getServer())
            .put("/collection-name/elementId")
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on element not matching schema [CASE: missing property]", () => {
        return request(getServer())
            .put("/collection-name/elementId")
            .send({anotherKey: "value"})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on element not matching schema [CASE: invalid property]", () => {
        return request(getServer())
            .put("/collection-name/elementId")
            .send({key: 5})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("404 on element not found", () => {
        return request(getServer())
            .put("/collection-name/elementId")
            .send({key: "value"})
            .expect(404)
            .expect({
                message: "No element found with id elementId"
            });
    });

    it("403 on authorization fail", () => {
        const options = {
            findElement: () => ({}),
            authorize: {
                replace: () => ({
                    authorized: false,
                    reason: "Reason message"
                })
            }
        };
        return request(getServer(options))
            .put("/collection-name/elementId")
            .send({key: "value"})
            .expect(403)
            .expect({
                message: "Reason message"
            });
    });

    it("204 on no errors", () => {
        const options = {
            findElement: () => ({})
        };
        return request(getServer(options))
            .put("/collection-name/elementId")
            .send({key: "value"})
            .expect(204);
    });

    it("dispatches a `replaced` event", () => {
        const options = {
            findElement: () => ({}),
            dispatchEvent: sinon.spy()
        };
        const middleware = (req, res, next) => {
            req.userId = "userId";
            next();
        };
        return request(getServer(options, middleware))
            .put("/collection-name/elementId")
            .send({key: "value"})
            .expect(204)
            .then(() => {
                expect(options.dispatchEvent).to.have.been.calledWith(
                    "element replaced in collection collection-name",
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

});
