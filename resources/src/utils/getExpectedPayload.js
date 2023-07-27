const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const cbor = require("../../assets/vendor/cbor.min.js").CBOR;

module.exports = async function getExpectedPayload(payloadPath, payloadType) {
    // convert js object to expected payload
    if (!fs.existsSync(payloadPath)) {
        throw Error(`Payload file does not exist! given path: ${payloadPath}`);
    }

    let payload = await readFile(payloadPath, "utf-8");
    switch (payloadType) {
        case "CBOR":
            return cbor.decode(new Uint8Array(hexToBytes(payload)).buffer);
        case "JSON":
            return JSON.parse(payload);
        case "STRING":
            return payload;
        case "BYTES":
            return Int8Array.from(hexToBytes(payload)).buffer;
        default: {
            throw Error(
                `Configured payload format type is not supported, given payload format: ${payloadType}`
            );
        }
    }
};

function hexToBytes(hex) {
    let bytes;
    for (bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
