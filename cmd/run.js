const apps = require("../lib/apps.js")

function runCommand(appname){
    try{
        apps.runApp(appname, Array.prototype.slice.call(arguments, 1))
    }
    catch(e) {
        console.log("There was an error: "+e)
    }
}

module.exports = runCommand