const path = require("path");
const moment = require("moment");

const constants = require("../constants");

const getExpectedPayload = require("../utils/getExpectedPayload.js");
const getUserConvertPayload = require("../utils/getUserConvertPayload");
const getDirectories = require("../utils/getDirectories.js");

const {
    getTemplateConfig,
    newTemplateUserScriptPath,
    getTests,
    newTemplatePath,
} = require("../lib/template");

const { getGroupIndex } = require("../lib/groups.js");

// extending the `expect` from jest with these custom matchers
require("../utils/validValue");
require("../utils/validNumberOfMeasurements");

const groupIds = getDirectories(constants.groupsRootPath);

if (groupIds.length === 0) {
    it("No tests to run", () => {
        expect(true).toBe(true);
    });
}

for (const groupId of groupIds) {
    const { name: groupName } = getGroupIndex(groupId);

    describe(groupName, () => {
        const groupPath = path.join(constants.groupsRootPath, groupId);
        const templateIds = getDirectories(groupPath);

        for (const templateId of templateIds) {
            const templateConfig = getTemplateConfig(groupId, templateId);
            const { name: templateName, userScript } = templateConfig;

            const userScriptPath = newTemplateUserScriptPath(
                groupId,
                templateId,
                userScript
            );
            let convertPayload;
            beforeAll(async () => {
                // load the user defined script once
                convertPayload = await getUserConvertPayload(userScriptPath);
            });
            let context;
            beforeEach(async () => {
                // set the mocked context before each test
                context = {
                    addMeasurement: jest.fn(),
                    logInfo: jest.fn(),
                    logWarn: jest.fn(),
                    logError: jest.fn(),
                };
            });

            describe(templateName, () => {
                const tests = getTests(groupId, templateId);
                if (tests === undefined) {
                    throw Error(
                        `group '${groupId}' with template '${templateId}' does not contain any tests!`
                    );
                }
                for (const [testName, test] of Object.entries(tests)) {
                    it(test.description || testName, async () => {
                        const {
                            payload: relativePayloadPath,
                            expectedMeasurements,
                            expectedLogs,
                            expectedErrors,
                        } = test;
                        const templatePath = newTemplatePath(
                            groupId,
                            templateId
                        );
                        const payloadPath = path.join(
                            templatePath,
                            relativePayloadPath
                        );

                        const expected =
                            expectedMeasurements?.map((measurement) => {
                                if (measurement.date === undefined) {
                                    return [
                                        measurement.ingestionId,
                                        measurement.value,
                                    ];
                                }
                                return [
                                    measurement.ingestionId,
                                    measurement.value,
                                    moment(measurement.date, [
                                        "x",
                                        "X",
                                        moment.ISO_8601,
                                    ]).toDate(),
                                ];
                            }) ?? [];

                        try {
                            // call inbound connector convert function with test payload
                            const payload = await getExpectedPayload(
                                payloadPath,
                                templateConfig.payloadFormat
                            );
                            convertPayload(payload, context);
                        } catch (error) {
                            expect([error.message]).toEqual(
                                expectedErrors?.map((error) => error.message) ??
                                    []
                            );
                        }

                        // Test logs first for clearer test evaluation (in case errors or warnings are logged)

                        expect(context.logInfo.mock.calls).toEqual(
                            expectedLogs
                                ?.filter((log) => log.level === "INFO")
                                .map((log) => [log.message]) ?? []
                        );

                        expect(context.logError.mock.calls).toEqual(
                            expectedLogs
                                ?.filter((log) => log.level === "ERROR")
                                .map((log) => [log.message]) ?? []
                        );

                        expect(context.logWarn.mock.calls).toEqual(
                            expectedLogs
                                ?.filter((log) => log.level === "WARN")
                                .map((log) => [log.message]) ?? []
                        );

                        // Test if added measurements are the same as the expected measurements
                        expect(
                            context.addMeasurement.mock.calls.length
                        ).toBeValidNumberOfMeasurements();
                        expect(context.addMeasurement.mock.calls).toEqual(
                            expected
                        );
                        context.addMeasurement.mock.calls.forEach((call) => {
                            expect(call[1]).toBeValidValue();
                        });
                    });
                }
            });
        }
    });
}
