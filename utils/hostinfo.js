const execSync = require('child_process').execSync
const path = require("path")

function getUid(){
    return execSync("id -u").toString().split("\n")[0]
}

function getGid(){
    return execSync("id -g").toString().split("\n")[0]
}

function getDamPath(){
    return path.resolve(__dirname, "..")
}

module.exports = {
    getUid: getUid,
    getGid: getGid,
    getDamPath: getDamPath
}