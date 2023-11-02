function convertPayload(payload, context) {
    payload.forEach((item) => {
        const { label, relations, value, timestamp } = item;

        if (!label || !relations["source_device"] || value === undefined || !timestamp) {
            // Skip processing this item if any of the required properties is undefined
            return; // Continue to the next iteration
        }
        // source_device is the subject external id and label is the metric external id
        const source_device = relations["source_device"];
        const ingestionId = `${source_device}$${toKebabCase(label)}`;

        const measurement = number(value);

        const date = timestamp;

        context.addMeasurement(ingestionId, measurement, date);
    });
}

function toKebabCase(inputString) {
    return inputString
        .trim() // Remove leading and trailing spaces
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/_/g, "-") // Replace underscores with hyphens
        .replace(/(\d+)([a-zA-Z]+)/g, "$1-$2") // Separate numbers from textual parts
        .replace(/([a-zA-Z]+)(\d+)/g, "$1-$2") // Handle numbers after textual parts
        .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert hyphens between camel case words
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // Handle consecutive uppercase letters
        .toLowerCase(); // Convert to lowercase
}
