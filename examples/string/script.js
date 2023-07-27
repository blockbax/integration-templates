function convertPayload(payload, context) {
    context.logInfo(payload);
    context.addMeasurement("my-text", payload);
}
