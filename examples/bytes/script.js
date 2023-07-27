function convertPayload(payload, context) {
    const bytes = new Uint8Array(payload);
    const metric1 = bytes.slice(0, 4);
    context.addMeasurement("test-1", metric1.toString());
    const metric2 = bytes.slice(4, 8);
    context.addMeasurement("test-2", metric2.toString());
    const metric3 = bytes.slice(8, 12);
    context.addMeasurement("test-3", metric3.toString());
    const metric4 = bytes.slice(12, 16);
    context.addMeasurement("test-4", metric4.toString());
}
