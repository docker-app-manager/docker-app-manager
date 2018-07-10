const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function upgradeCommand(appname){
    repos.getApp(appname).then(app => {
        apps.upgradeApp(app).then( () => {
            console.log("DockerApp "+appname+" upgraded!")
        }).catch(e => {
            console.log("There was an error: "+e)
        })
    }).catch(e => {
        if(e) console.log("There was an error: "+e)
        else console.log("DockerApp "+appname+" not found!")
    })
}

module.exports = upgradeCommand