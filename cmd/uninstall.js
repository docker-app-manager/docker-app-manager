const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function uninstallCommand(appname){
    repos.getApp(appname).then(app => {
        apps.uninstallApp(app).then( () => {
            console.log("App "+appname+" uninstalled!")
        }).catch(e => {
            console.log("There was an error: "+e)
        })
    }).catch(e => {
        if(e) console.log("There was an error: "+e)
        else console.log("App "+appname+" not found!")
    })
}

module.exports = uninstallCommand