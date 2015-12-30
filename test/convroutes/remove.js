import chai, {expect} from "chai";
import convexpress from "convexpress";
import express from "express";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import request from "supertest-as-promised";

chai.use(sinonChai);

import getRemove from "../../src/convroutes/remove";

describe("remove convroute", () => {

    function getServer (options, middleware) {
        const router = convexpress({}).convroute(getRemove({
            name: "collection-name",
            authorize: {
                remove: () => ({
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

    it("404 on element not found", () => {
        return request(getServer())
            .delete("/collection-name/elementId")
            .expect(404)
            .expect({
                message: "No element found with id elementId"
            });
    });

    it("403 on authorization fail", () => {
        const options = {
            findElement: () => ({}),
            authorize: {
                remove: () => ({
                    authorized: false,
                    reason: "Reason message"
                })
            }
        };
        return request(getServer(options))
            .delete("/collection-name/elementId")
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
            .delete("/collection-name/elementId")
            .expect(204);
    });

    it("dispatches a `removed` event", () => {
        const options = {
            findElement: () => ({}),
            dispatchEvent: sinon.spy()
        };
        const middleware = (req, res, next) => {
            req.userId = "userId";
            next();
        };
        return request(getServer(options, middleware))
            .delete("/collection-name/elementId")
            .expect(204)
            .then(() => {
                expect(options.dispatchEvent).to.have.been.calledWith(
                    "element removed in collection collection-name",
                    {id: "elementId"},
                    {
                        sourceUserId: "userId",
                        partitionKey: "collection-name-elementId"
                    }
                );
            });
    });

});
