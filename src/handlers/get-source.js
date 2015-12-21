export default function getSource (req) {
    return {
        userId: req.userId || null,
        producerId: req.producerId
    };
}
