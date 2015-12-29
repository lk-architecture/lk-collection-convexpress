export const responses = {
    "404": {
        description: "Element not found"
    }
};
export function getMiddleware (options) {
    const {findElement, name} = options;
    return async (req, res, next) => {
        if (!await findElement(name, req.params.elementId)) {
            res.status(404).send({
                message: `No element found with id ${req.params.elementId}`
            });
        } else {
            next();
        }
    };
}
