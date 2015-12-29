export const responses = {
    "403": {
        description: "Cannot perform the operation"
    }
};

export function getMiddleware (options) {
    const {authorize, findElement, name} = options;
    return async (req, res, next) => {

        // Default authResult
        var authResult = {
            authorized: false,
            reason: "Cannot perform this operation"
        };

        // Run the appropriate authorize function
        if (req.method === "POST") {
            authResult = await authorize.insert(
                req.user,
                req.body
            );
        } else if (req.method === "PUT") {
            authResult = await authorize.replace(
                req.user,
                await findElement(name, req.params.elementId),
                req.body
            );
        } else if (req.method === "DELETE") {
            authResult = await authorize.remove(
                req.user,
                await findElement(name, req.params.elementId)
            );
        }

        // Ensure request is authorized
        if (!authResult.authorized) {
            res.status(403).send({
                message: authResult.reason
            });
        } else {
            next();
        }

    };
}
