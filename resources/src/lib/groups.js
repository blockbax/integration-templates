const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");
const constants = require("../constants");

function newGroup(groupID, groupIndex, templates = []) {
    return {
        groupID,
        groupIndex,
        templates,
    };
}

function newGroupPath(groupId, options = {}) {
    const { root = constants.groupsRootPath } = options;
    return path.join(root, groupId);
}

function newGroupIndexPath(groupId, options = {}) {
    const { root = constants.groupsRootPath } = options;
    return path.join(root, groupId, constants.groupIndexFileName);
}

function groupExists(groupId, options = {}) {
    const groupPath = newGroupPath(groupId, options);
    const groupIndexPath = newGroupIndexPath(groupId, options);
    return fs.existsSync(groupPath) && fs.existsSync(groupIndexPath);
}

function getGroupIndex(groupId, options = {}) {
    const groupIndexPath = newGroupIndexPath(groupId, options);
    return yaml.load(fs.readFileSync(groupIndexPath, "utf8"));
}

function newGroupContact(email, options = {}) {
    const { website, linkedin, github, facebook, twitter, instagram } = options;
    return {
        website,
        email,
        linkedin,
        github,
        facebook,
        twitter,
        instagram,
    };
}

function newGroupIndex(name, description, contact) {
    return {
        name,
        description,
        contact,
    };
}

module.exports = {
    newGroup,
    newGroupPath: newGroupPath,
    newGroupIndexPath,
    groupExists,
    getGroupIndex,
    newGroupContact,
    newGroupIndex,
};
