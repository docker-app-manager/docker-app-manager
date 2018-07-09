const repos = require("../lib/repos.js")

function updateCommand(){
    repos.updateAll()
}

module.exports = updateCommand