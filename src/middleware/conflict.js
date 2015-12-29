export const responses = {
    "409": {
        description: "An element with the same id already exists"
    }
};
export function getMiddleware (options) {
    const {findElement, name} = options;
    return async (req, res, next) => {
        /*
        *   If an id was provided, ensure no element with the same id exists
        *   before inserting it.
        */
        if (req.body.id && await findElement(name, req.body.id)) {
            res.status(409).send({
                message: `Element with id ${req.body.id} already exists`
            });
        } else {
            next();
        }
    };
}
