const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function runCommand(appname){
    try{
        apps.runApp(appname)
    }
    catch(e) {
        console.log("There was an error: "+e)
    }
}

module.exports = runCommand