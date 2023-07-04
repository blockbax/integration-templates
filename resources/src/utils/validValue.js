function validateNumber(number) {
  const numberStringPreDecimal = number.toString().split(".")[0];
  const numberStringPostDecimal = number.toString().split(".")[1];
  if (numberStringPostDecimal === undefined) {
    return numberStringPreDecimal.length <= 20;
  }
  return (
    numberStringPreDecimal.length <= 20 && numberStringPostDecimal.length <= 8
  );
}

function isLocation(value) {
  return typeof value === "object" && "lat" in value && "lon" in value;
}

function toBeValidValue(value) {
  if (isLocation(value)) {
    let locationInvalidMessage = [];
    if (!validateNumber(value.lat) || value.lat < -90 || value.lat > 90) {
      locationInvalidMessage.push(
        `expected location latitude: ${this.utils.printReceived(
          value.lat
        )} to be between -90 to 90 and 8 digits behind the decimal point`
      );
    }
    if (!validateNumber(value.lon) || value.lat < -180 || value.lat > 180) {
      locationInvalidMessage.push(
        `expected location longitude: ${this.utils.printReceived(
          value.lon
        )} to be between -180 to 180 and 8 digits behind the decimal point`
      );
    }
    if ("alt" in value) {
      if (!validateNumber(value.alt)) {
        locationInvalidMessage.push(
          `expected location altitude: ${this.utils.printReceived(
            value.alt
          )} to be up to 20 digits before and 8 digits behind the decimal point.`
        );
      }
    }
    if (locationInvalidMessage.length > 0) {
      return {
        message: () => locationInvalidMessage.join("\n"),
        pass: false,
      };
    }
  } else if (typeof value === "object") {
    return {
      message: () =>
        `expected location value: ${this.utils.printReceived(
          JSON.stringify(value)
        )} to have properties: ${["lat", "lon"].join(",")}.`,
      pass: false,
    };
  }
  if (typeof value === "string" && isNaN(value)) {
    if (value.length > 100) {
      return {
        message: () =>
          `expected text value: ${this.utils.printReceived(
            value
          )} not to more than 100 characters.`,
        pass: false,
      };
    }
  }
  if (!isNaN(value) && !validateNumber(value)) {
    return {
      message: () =>
        `expected number value: ${this.utils.printReceived(
          JSON.stringify(value)
        )} to be up to 20 digits before and 8 digits behind the decimal point.`,
      pass: false,
    };
  }
  return {
    message: () => ``,
    pass: true,
  };
}

expect.extend({
  toBeValidValue,
});
