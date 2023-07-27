const fs = require("fs");

// tools
function pathExists(path) {
    try {
        return fs.existsSync(path);
    } catch (err) {
        console.error(err);
    }
}

function readFile(filePath, contents) {
    if (pathExists(filePath)) {
        return fs.readFileSync(filePath, contents);
    }
}

module.exports = {
    pathExists,
    readFile,
};
