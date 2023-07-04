function convertPayload(payload, context) {
    if (!Array.isArray(payload.data)) {
        context.logError("Expected 'data' in payload to be an array");
        return;
    }
    
    for (const data of payload.data) {
        if (data.recorded == null) {
            context.logError("Missing value for 'recorded'");
            return;
        }

        if (data.serialNumber == null) {
            context.logError("Missing value for 'serialNumber'");
            return;
        }

        const timestamp = date(data.recorded);
        const ingestionIdPrefix = `${data.serialNumber}\$`;

        if (data.radonShortTermAvg != null) {
            context.addMeasurement(
                ingestionIdPrefix + "radonShortTermAvg",
                data.radonShortTermAvg,
                timestamp
            );
        }

        if (data.humidity != null) {
            context.addMeasurement(
                ingestionIdPrefix + "humidity",
                data.humidity,
                timestamp
            );
        }

        if (data.temp != null) {
            context.addMeasurement(
                ingestionIdPrefix + "temp",
                data.temp,
                timestamp
            );
        }

        if (data.co2 != null) {
            context.addMeasurement(
                ingestionIdPrefix + "co2",
                data.co2,
                timestamp
            );
        }

        if (data.pressure != null) {
            context.addMeasurement(
                ingestionIdPrefix + "pressure",
                data.pressure,
                timestamp
            );
        }

        if (data.tvoc != null) {
            context.addMeasurement(
                ingestionIdPrefix + "tvoc",
                data.tvoc,
                timestamp
            );
        }

        if (data.light != null) {
            context.addMeasurement(
                ingestionIdPrefix + "light",
                data.light,
                timestamp
            );
        }

        if (data.rssi != null) {
            context.addMeasurement(
                ingestionIdPrefix + "rssi",
                data.rssi,
                timestamp
            );
        }

        if (data.batteryPercentage != null) {
            context.addMeasurement(
                ingestionIdPrefix + "batteryPercentage",
                data.batteryPercentage,
                timestamp
            );
        }

        if (data.virusRisk != null) {
            context.addMeasurement(
                ingestionIdPrefix + "virusRisk",
                data.virusRisk,
                timestamp
            );
        }

        if (data.mold != null) {
            context.addMeasurement(
                ingestionIdPrefix + "mold",
                data.mold,
                timestamp
            );
        }
    }
}
