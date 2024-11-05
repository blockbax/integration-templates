function convertPayload(payload, context) {
    payload.forEach((item) => {
        const { source_device, event_type_label, occurred_at, event_value_description } = item;

        if (!source_device || !event_type_label || !event_value_description || occurred_at === undefined) {
            return;
        }

        const ingestionIdEventTypeLabel = `${source_device}$event-type-label`;
        const ingestionIdEventValueDescription = `${source_device}$event-value-description`;
        const IngestionDate = date(occurred_at * 1000);
        context.addMeasurement(ingestionIdEventTypeLabel, event_type_label, IngestionDate);
        context.addMeasurement(ingestionIdEventValueDescription, event_value_description, IngestionDate);
    });
};
