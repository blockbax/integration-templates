// Update template to version 2
function convertPayload(payload, context) {
    context.addMeasurement(
        "test-ingestion-id2",
        payload.number,
        date(payload.date)
    );
}
