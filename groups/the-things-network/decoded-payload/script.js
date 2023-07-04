function convertPayload(payload, context) {
    // See: https://www.thethingsindustries.com/docs/reference/data-formats/#uplink-messages
    const { uplink_message } = payload;
    const timestamp = date(payload.received_at);
    const subjectExternalId = payload.end_device_ids.dev_eui;
    const { decoded_payload } = uplink_message;
    if (decoded_payload != null) {
        for (const [key, value] of Object.entries(decoded_payload)) {
            if (value != null) {
                context.addMeasurement(
                    `${subjectExternalId}\$${key}`,
                    value,
                    timestamp
                );
            }
        }
    }
}
