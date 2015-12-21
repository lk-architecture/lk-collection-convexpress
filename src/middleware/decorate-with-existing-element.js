export default function decorateWithExistingElement (findElement) {
    return async (req, res, next) => {
        if (req.method === "POST") {
            req.elementId = req.body.id;
        } else if (req.method === "PUT" || req.method === "DELETE") {
            req.elementId = req.params.id;
        }
        req.existingElement = (
            req.elementId ? await findElement(req.collection, req.elementId) : null
        );
        next();
    };
}
