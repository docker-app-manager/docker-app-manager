const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function installCommand(appname){
    repos.getApp(appname).then(app => {
        apps.installApp(app).then( () => {
            console.log("App "+appname+" installed!")
        }).catch(e => {
            console.log("There was an error: "+e)
            apps.uninstallApp(app)
        })
    }).catch(e => {
        if(e) console.log("There was an error: "+e)
        else console.log("App "+appname+" not found!")
    })
}

module.exports = installCommand