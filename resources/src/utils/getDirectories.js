const fs = require("fs");
const path = require("path");

module.exports = getDirectories = (srcPaths) => {
    if (!Array.isArray(srcPaths)) {
        srcPaths = [srcPaths];
    }
    let directories = [];
    srcPaths.forEach((srcPath) => {
        directories.push(
            fs
                .readdirSync(srcPath)
                .filter((file) =>
                    fs.statSync(path.join(srcPath, file)).isDirectory()
                )
        );
    });
    return directories.flat();
};
