export default function notFound () {
    return (req, res, next) => {
        if ((req.method === "PUT" || req.method === "DELETE") && !req.existingElement) {
            res.status(404).send({
                message: `No element found with id ${req.elementId}`
            });
        } else {
            next();
        }
    };
}
