const path = require("path");

// Constants
const groupDirectoryName = "groups/";
const examplesDirectoryName = "examples/";
const groupsRootPath = path.join(__dirname, "..", "..", groupDirectoryName);
const examplesRootPath = path.join(__dirname, "..", "..", examplesDirectoryName);
const groupIndexFileName = "index.yml";
const templateConfigFileName = "config.yml";
const templateTestsSuiteFileName = "tests.yml";
const templatePayloadsDirectoryName = "payloads/";
const templateAssetsDirectoryName = "assets/";
const templateDefaultUserScriptName = "script.js";

const assetsPath = path.join(__dirname, "..", "assets");

const dayjsScriptPath = path.join(assetsPath, "vendor", "dayjs.min.js");
const customParseFormatPath = path.join(
    assetsPath,
    "vendor",
    "customParseFormat.min.js"
);
const cborPath = path.join(assetsPath, "vendor", "cbor.min.js");
const publicLibraryPath = path.join(assetsPath, "publicLibrary.js");

module.exports = {
    groupDirectoryName,
    groupsRootPath,
    examplesRootPath,
    groupIndexFileName,
    templateConfigFileName,
    templateTestsSuiteFileName,
    templatePayloadsDirectoryName,
    templateAssetsDirectoryName,
    templateDefaultUserScriptName,
    dayjsScriptPath,
    customParseFormatPath,
    cborPath,
    publicLibraryPath,
};
