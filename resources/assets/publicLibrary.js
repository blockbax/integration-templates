function location(lat, lon, alt) {
    const location = { lat: number(lat), lon: number(lon) };
    if (alt) {
        location.alt = number(alt);
    }
    return location;
}

function number(value) {
    // The '+' here removes the excess 0s at the end, introduced by the .toFixed(8).
    // .toFixed is responsible for limiting the precision.
    return +parseFloat(value).toFixed(8);
}

function date(value, format) {
    const result = dayjs(value, format);
    if (!result.isValid()) {
        if (format) {
            throw `Could not parse '${value}' to date using format '${format}'`;
        } else {
            throw `Could not parse '${value}' to date`;
        }
    }
    return result.toDate();
}

dayjs.extend(dayjs_plugin_customParseFormat);
