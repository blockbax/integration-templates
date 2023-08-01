function convertPayload(payload, context) {
    context.addMeasurement(
        "test-ingestion-id",
        payload.number,
        date(payload.date)
    );
}
