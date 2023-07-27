function convertPayload(payload, context) {
    // Parse Sensor Measurement Lists (SenML)
    let baseName;
    let baseTime;
    let baseValue;

    if (!Array.isArray(payload)) {
        context.logError("Payload is not an array");
        return;
    }

    payload.forEach((element) => {
        let measurementValue = null;

        const {
            bn,
            bt,
            bv,
            n: name,
            v: value,
            t: time,
            vs: valueString,
            vb: valueBool,
            vd: valueData,
        } = element;

        // Update base values
        if (bn != null) {
            baseName = bn;
        }
        if (bt != null) {
            baseTime = bt;
        }
        if (bv != null) {
            baseValue = bv;
        }

        // Set timestamp
        const timestamp = parseTimestamp(baseTime, time);

        // Set measurement value
        if (baseValue != null && !isNaN(baseValue) && isFinite(baseValue)) {
            measurementValue = number(baseValue);
        }

        // Override base value with received value
        if (value != null && !isNaN(value) && isFinite(value)) {
            measurementValue = number(value);
        }
        // Override value with either string value, boolean value or data value
        if (
            valueString != null &&
            (typeof valueString === "string" || valueString instanceof String)
        ) {
            measurementValue = valueString;
        }
        if (valueBool != null) {
            // Blockbax does not support boolean types, convert to either 1 or 0
            measurementValue = valueBool ? 1 : 0;
        }

        if (
            valueData != null &&
            (typeof valueData === "string" || valueData instanceof String)
        ) {
            const decodedNumberValue = parseValueData(valueData);
            // The decoded value can still be of any type, for now we only accept number values
            // Check if the decoded value buffer can be converted to a number then set as the measurement value
            if (!isNaN(decodedNumberValue) && isFinite(decodedNumberValue)) {
                measurementValue = number(decodedNumberValue);
            }
        }

        const ingestionId = parseIngestionID(baseName, name);

        if (
            ingestionId != null &&
            timestamp != null &&
            measurementValue != null
        ) {
            context.addMeasurement(ingestionId, measurementValue, timestamp);
        }
    });
}

function parseIngestionID(baseName, name) {
    /* Docs from: https://www.rfc-editor.org/rfc/rfc8428#section-4.2

    "Name of the sensor or parameter.  When appended to the Base
    Name field, this must result in a globally unique identifier for
    the resource.  The name is optional, if the Base Name is present.
    If the name is missing, the Base Name must uniquely identify the
    resource.  This can be used to represent a large array of
    measurements from the same sensor without having to repeat its
    identifier on every measurement."
    */
    if (baseName != null && name != null) {
        // We use the basename as subject external ID and the name as Metric external ID
        return `${baseName}\$${name}`;
    } else if (baseName == null && name != null) {
        // sender is responsible to keep the name unique if no base name is provided
        return `${name}`;
    } else if (baseName != null && name == null) {
        // sender is responsible to keep the base name unique if no name is provided
        return `${baseName}`;
    }
    return null;
}

function parseTimestamp(baseTime, time) {
    /* Docs from https://www.rfc-editor.org/rfc/rfc8428#section-4.5.3

    "If either the Base Time or Time value is missing, the missing field
    is considered to have a value of zero.  The Base Time and Time values
    are added together to get a value representing the time of
    measurement."
    */

    if (baseTime == null) {
        baseTime = 0;
    }
    if (time == null) {
        time = 0;
    }

    if (
        (isNaN(baseTime) || isNaN(time)) &&
        (!isFinite(baseTime) || !isFinite(time))
    ) {
        return null;
    }

    const timestamp = baseTime + time;

    /*
    "Some devices have accurate time while others do not, so SenML
    supports absolute and relative times.  Time is represented in
    floating point as seconds.  Values greater than or equal to 2**28
    represent an absolute time relative to the Unix epoch.  Values less
    than 2**28 represent time relative to the current time.

    Values greater than or equal to 2**28 represent an absolute time
    relative to the Unix epoch (1970-01-01T00:00Z in UTC time), and the
    time is counted the same way as the Portable Operating System
    Interface (POSIX) "seconds since the epoch" [TIME_T].  Therefore, the
    smallest absolute Time value that can be expressed (2**28) is
    1978-07-04 21:24:16 UTC.

    Because Time values up to 2**28 are used for representing time
    relative to "now" and Time and Base Time are added together, care
    must be taken to ensure that the sum does not inadvertently reach
    2**28 (i.e., absolute time) when relative time was intended to be
    used."
    */

    if (timestamp < 2 ** 28) {
        // Relative time from "now"
        const nowMillis = new Date().getTime();
        return date(nowMillis + timestamp * 1000);
    }
    // Absolute time
    return date(timestamp * 1000);
}

function parseValueData(valueData) {
    /* From https://www.rfc-editor.org/rfc/rfc8428#section-4.3: 
    
    "Data Value is a base64-encoded string with the URL-safe alphabet as defined in Section 5 of [RFC4648], with padding omitted."
    
    Add back padding using this guide: https://gist.github.com/catwell/3046205
    */
    let valueDataWithPadding;
    if (valueData.length % 4 == 0) {
        valueDataWithPadding = valueData;
    } else if (valueData.length % 4 == 2) {
        valueDataWithPadding = valueData + "==";
    } else if (valueData.length % 4 == 3) {
        valueDataWithPadding = valueData + "=";
    }
    valueDataWithPadding = valueDataWithPadding.replace("-", "+");
    valueDataWithPadding = valueDataWithPadding.replace("_", "/");
    return parseFloat(Buffer.from(valueDataWithPadding, "base64"));
}
