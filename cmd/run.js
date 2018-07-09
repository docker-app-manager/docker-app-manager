const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function runCommand(appname){
    repos.getApp(appname).then(app => {
        apps.runApp(app)
    }).catch(e => {
        console.log("There was an error: "+e)
    })
}

module.exports = runCommand