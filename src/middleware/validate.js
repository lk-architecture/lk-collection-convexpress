import Ajv from "ajv";

export default function validate (schema) {
    const ajv = new Ajv();
    const doValidate = ajv.compile(schema);
    return (req, res, next) => {
        var isValid = true;
        if (req.method === "POST" || req.method === "PUT") {
            isValid = doValidate(req.body);
        }
        if (!isValid) {
            res.status(400).send({
                message: "Invalid body",
                details: doValidate.errors
            });
        } else {
            next();
        }
    };
}
