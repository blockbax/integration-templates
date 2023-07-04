const yaml = require("js-yaml");
const path = require("path");
const constants = require("../constants");
const { newGroupPath } = require("./groups");
const {
  pathExists,
  readFile,
} = require("../utils/utils");

function newTemplateConfig(
  id,
  name,
  description,
  userScript,
  protocol,
  payloadFormat,
  options = {}
) {
  const { version = 1, deprecated = false } = options;

  if (!userScript.endsWith(".js")) {
    userScript = userScript + ".js";
  }

  return {
    id,
    version,
    name,
    description,
    userScript,
    protocol,
    payloadFormat,
    deprecated,
  };
}

function newTemplatePath(groupId, templateId, options = {}) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(groupPath, templateId);
}

function newTemplateConfigPath(groupId, templateId, options = {}) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(
    groupPath,
    templateId,
    constants.templateConfigFileName
  );
}

function newTemplateTestSuitePath(groupId, templateId, options = {}) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(
    groupPath,
    templateId,
    constants.templateTestsSuiteFileName
  );
}

function newTemplateAssetsPath(groupId, templateId, options = {}) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(
    groupPath,
    templateId,
    constants.templateAssetsDirectoryName
  );
}

function newTemplatePayloadsPath(groupId, templateId, options = {}) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(
    groupPath,
    templateId,
    constants.templatePayloadsDirectoryName
  );
}

function newTemplateUserScriptPath(
  groupId,
  templateId,
  userScriptName = constants.templateDefaultUserScriptName,
  options = {}
) {
  const groupPath = newGroupPath(groupId, options);
  return path.join(groupPath, templateId, userScriptName);
}

function templateExists(groupId, templateId, options = {}) {
  const templatePath = newTemplatePath(groupId, templateId, options);
  const templateConfigPath = newTemplateConfigPath(
    groupId,
    templateId,
    options
  );
  return pathExists(templatePath) && templateConfigPath;
}

function templateUserScriptExists(
  groupId,
  templateId,
  userScriptName = constants.templateDefaultUserScriptName,
  options = {}
) {
  const templateUserScriptPath = newTemplateUserScriptPath(
    groupId,
    templateId,
    userScriptName,
    options
  );
  return pathExists(templateUserScriptPath);
}

function templateUserTestSuiteExists(groupId, templateId, options = {}) {
  const templateUserScriptPath = newTemplateTestSuitePath(
    groupId,
    templateId,
    options
  );
  return pathExists(templateUserScriptPath);
}

function getTemplateConfig(groupId, templateId, options = {}) {
  const templateConfigPath = newTemplateConfigPath(
    groupId,
    templateId,
    options
  );
  return yaml.load(readFile(templateConfigPath, "utf8"));
}

function getTests(groupId, templateId, options = {}) {
  const testsPath = newTemplateTestSuitePath(
    groupId,
    templateId,
    options
  );
  return yaml.load(readFile(testsPath, "utf8"));
}

module.exports = {
  newTemplateConfig,
  newTemplatePath,
  newTemplateConfigPath,
  newTemplateTestSuitePath,
  newTemplateAssetsPath,
  newTemplateUserScriptPath,
  newTemplatePayloadsPath,
  templateExists,
  templateUserScriptExists,
  templateUserTestSuiteExists,
  getTemplateConfig,
  getTests,
};
