const { scaffoldGroup } = require("./groups");
const { scaffoldTemplates } = require("./template");

function scaffold(InboundConnectorTemplatesDTO, options = {}) {
  const { index, configs } = InboundConnectorTemplatesDTO;
  scaffoldGroup(index, options);
  scaffoldTemplates(index.id, configs, options);
}

module.exports = { scaffold };
