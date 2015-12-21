export default function decorateWithProducerId (producerId) {
    return (req, res, next) => {
        req.producerId = producerId;
        next();
    };
}
