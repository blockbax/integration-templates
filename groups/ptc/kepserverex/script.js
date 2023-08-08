function convertPayload(payload, context) {
    // See: https://www.kepware.com/getattachment/c5c35697-8a91-4273-8077-b28fe5d60d8c/iot-gateway-manual.pdf#Standard%20Template%20Data%20Format
    if (!Array.isArray(payload.values)) {
        context.logError("Payload values is not an array");
        return;
    }
    for (const value of payload.values) {
        const timestamp = value.t ?? payload.timestamp;
        if (
            value.q &&
            value.v != null &&
            timestamp != null &&
            value.id != null
        ) {
            context.addMeasurement(value.id, number(value.v), date(timestamp));
        }
    }
}
