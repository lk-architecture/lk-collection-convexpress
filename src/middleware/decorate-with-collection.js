export default function decorateWithCollection (collection) {
    return (req, res, next) => {
        req.collection = collection;
        next();
    };
}
