export default function getSource (req) {
    return {
        userId: (req.user && req.user._id) || null,
        producerId: req.producerId
    };
}
