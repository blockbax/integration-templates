const fs = require("fs");
const util = require("util");
const constants = require("../constants");
const readFile = util.promisify(fs.readFile);

module.exports = async function getUserConvertPayload(userScriptPath) {
  const dayjsScript = await readFile(constants.dayjsScriptPath, "utf-8");
  const dayJsCustomParseFormatScript = await readFile(
    constants.customParseFormatPath,
    "utf-8"
  );
  const publicLibraryScript = await readFile(
    constants.publicLibraryPath,
    "utf-8"
  );
  const userScript = await readFile(userScriptPath, "utf-8");

  // From https://gitlab.com/blockbax/backend/libraries/payload-converter/-/blob/master/src/main/java/com/blockbax/payloadconverter/impl/user_defined_js/UserPayloadConversionBuilder.java.
  const scripts = [
    dayjsScript,
    dayJsCustomParseFormatScript,
    publicLibraryScript,
    userScript,
    `return convertPayload;`,
  ];

  // Use Function constructor instead of eval to have external UMD libraries globally available.
  return new Function(scripts.join("\n"))();
};
