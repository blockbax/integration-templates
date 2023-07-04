function convertPayload(payload, context) {
    if (payload.SerNo != null) {
        const ingestionIdPrefix = payload.SerNo + "$";
        for (const record of payload.Records || []) {
            convertRecord(context, ingestionIdPrefix, record);
        }
    }
}

function convertRecord(context, ingestionIdPrefix, record) {
    const timestamp = date(record.DateUTC + " +00:00", "YYYY-MM-DD HH:mm:ss Z");
    if (record.Reason != null) {
        context.addMeasurement(
            ingestionIdPrefix + "reason",
            record.Reason,
            timestamp
        );
    }

    for (const field of record.Fields || []) {
        convertField(context, timestamp, ingestionIdPrefix, field);
    }
}

function convertField(context, timestamp, ingestionIdPrefix, field) {
    if (field.FType != null) {
        switch (field.FType) {
            case 0:
                convertFieldTyp0LocationData(
                    context,
                    ingestionIdPrefix + field.FType,
                    timestamp,
                    field
                );
                break;
            case 2:
                convertFieldTyp2DigitalData(
                    context,
                    ingestionIdPrefix + field.FType,
                    timestamp,
                    field
                );
                break;
            case 6:
                convertFieldTyp6AnalogueData(
                    context,
                    ingestionIdPrefix + field.FType,
                    timestamp,
                    field
                );
                break;
            case 24:
                convertFieldTyp24HighG(
                    context,
                    ingestionIdPrefix + field.FType,
                    timestamp,
                    field
                );
                break;
            default:
                context.logError(
                    `Unknown F type send: ${
                        field.FType
                    }, payload: ${JSON.stringify(payload)}`
                );
        }
    }
}

function convertFieldTyp0LocationData(
    context,
    ingestionIdFTypePrefix,
    timestamp,
    field
) {
    if (field.Lat != null && field.Long != null && field.Alt != null) {
        // Filter out positions with Lat and Lon exactly 0.0
        if (!(field.Lat >= 0.0 && field.Long >= 0.0)) {
            context.addMeasurement(
                ingestionIdFTypePrefix + "-position",
                location(field.Lat, field.Long, field.Alt),
                timestamp
            );
        }
    }
    if (field.Spd != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-speed",
            field.Spd,
            timestamp
        );
    }
    if (field.SpdAcc != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-speed-accuracy",
            field.SpdAcc,
            timestamp
        );
    }
    if (field.Head != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-2d-heading",
            field.Head,
            timestamp
        );
    }
    if (field.PDOP != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-pdop",
            field.PDOP,
            timestamp
        );
    }
    if (field.PosAcc != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-position-accuracy",
            field.PosAcc,
            timestamp
        );
    }
}
function convertFieldTyp2DigitalData(
    context,
    ingestionIdFTypePrefix,
    timestamp,
    field
) {
    if (field.DIn != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-digital-input",
            field.DIn,
            timestamp
        );
    }
    if (field.DOut != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-digital-output",
            field.DOut,
            timestamp
        );
    }
    if (field.DevStat != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-device-status",
            field.DevStat,
            timestamp
        );
    }
}

function convertFieldTyp6AnalogueData(
    context,
    ingestionIdFTypePrefix,
    timestamp,
    field
) {
    if (field.AnalogueData != null) {
        const analogueData = field.AnalogueData;
        if (analogueData["1"] != null) {
            context.addMeasurement(
                ingestionIdFTypePrefix + "-internal-battery-voltage",
                analogueData["1"],
                timestamp
            );
        }
        if (analogueData["2"] != null) {
            context.addMeasurement(
                ingestionIdFTypePrefix + "-external-voltage",
                analogueData["2"],
                timestamp
            );
        }
        if (analogueData["3"] != null) {
            context.addMeasurement(
                ingestionIdFTypePrefix + "-internal-temperature",
                analogueData["3"],
                timestamp
            );
        }
        if (analogueData["4"] != null) {
            context.addMeasurement(
                ingestionIdFTypePrefix + "-gsm-signal-strength",
                analogueData["4"],
                timestamp
            );
        }
    }
}

function convertFieldTyp24HighG(
    context,
    ingestionIdFTypePrefix,
    timestamp,
    field
) {
    if (field.Peak != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-peak",
            field.Peak,
            timestamp
        );
    }
    if (field.Avg != null) {
        context.addMeasurement(
            ingestionIdFTypePrefix + "-average",
            field.Avg,
            timestamp
        );
    }
}
