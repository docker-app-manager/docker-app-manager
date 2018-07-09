const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function upgradeCommand(appname){
    repos.getApp(appname).then(app => {
        apps.upgradeApp(app).then( () => {
            console.log("App "+appname+" upgraded!")
        }).catch(e => {
            console.log("There was an error: "+e)
        })
    }).catch(e => {
        if(e) console.log("There was an error: "+e)
        else console.log("App "+appname+" not found!")
    })
}

module.exports = upgradeCommand