function convertPayload(payload, context) {
    context.addMeasurement("my-text", payload);
}
