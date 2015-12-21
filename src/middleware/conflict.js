export default function conflict () {
    return (req, res, next) => {
        if (req.method === "POST" && req.elementId && req.existingElement) {
            res.status(409).send({
                message: `Element with id ${req.elementId} already exists`
            });
        } else {
            next();
        }
    };
}
