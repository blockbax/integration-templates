function convertPayload(payload, context) {
    const ingestionIdPrefix = payload.id + "$";
    const timestamp = date(payload.timestamp);
    for (const [key, value] of Object.entries(payload.data)) {
        if (value != null) {
            context.addMeasurement(ingestionIdPrefix + key, value, timestamp);
        }
    }
}