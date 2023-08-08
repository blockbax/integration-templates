function location(lat, lon, alt) {
    const location = { lat: number(lat), lon: number(lon) };
    if (alt) {
        location.alt = number(alt);
    }
    return location;
}

function number(value) {
    return parseFloat(value).toFixed(8);
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
