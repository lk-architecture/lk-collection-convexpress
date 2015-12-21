export default function authorize (auth) {
    return async (req, res, next) => {
        var authResult = {
            authorized: false,
            code: 401,
            reason: "Not authorized"
        };
        if (req.method === "POST") {
            authResult = await auth.insert(req.user, req.existingElement);
        } else if (req.method === "PUT") {
            authResult = await auth.replace(req.user, req.existingElement, req.body);
        } else if (req.method === "DELETE") {
            authResult = await auth.remove(req.user, req.existingElement);
        }
        if (!authResult.authorized) {
            res.status(authResult.code).send({
                message: authResult.reason
            });
        } else {
            next();
        }
    };
}
