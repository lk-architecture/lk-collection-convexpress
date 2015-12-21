import {expect} from "chai";

import getSource from "handlers/get-source";

describe("getSource function", () => {

    it("returns the correct source for the event [CASE: `req.userId` defined]", () => {
        const req = {
            userId: "userId",
            producerId: "producerId"
        };
        const source = getSource(req);
        expect(source).to.deep.equal({
            userId: "userId",
            producerId: "producerId"
        });
    });

    it("returns the correct source for the event [CASE: `req.userId` not defined]", () => {
        const req = {
            producerId: "producerId"
        };
        const source = getSource(req);
        expect(source).to.deep.equal({
            userId: null,
            producerId: "producerId"
        });
    });

});
