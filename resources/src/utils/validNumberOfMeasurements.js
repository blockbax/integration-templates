function toBeValidNumberOfMeasurements(numberOfMeasurements) {
    if (numberOfMeasurements > 500) {
        return {
            message: () =>
                `expected number of measurements: ${this.utils.printReceived(
                    numberOfMeasurements
                )} to be less than the maximum number of measurements: ${this.utils.printExpected(
                    500
                )}`,
            pass: false,
        };
    }
    return {
        message: () => ``,
        pass: true,
    };
}

expect.extend({
    toBeValidNumberOfMeasurements,
});
