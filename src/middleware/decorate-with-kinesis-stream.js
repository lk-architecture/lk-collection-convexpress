export default function decorateWithKinesisStream (kinesisStream) {
    return (req, res, next) => {
        req.kinesisStream = kinesisStream;
        next();
    };
}
