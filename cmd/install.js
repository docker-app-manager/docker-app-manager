const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function installCommand(appname){
    const args = require("minimist")(Array.prototype.slice.call(arguments))
    console.log(args)
    if(args.d){
        apps.installDirectory(args.d).then(app => {
            console.log("DockerApp "+app.name+" installed!")
        })
    } else {
        let appname = args._[0]
        repos.getApp(appname).then(app => {
            apps.installApp(app).then( () => {
                console.log("DockerApp "+appname+" installed!")
            }).catch(e => {
                console.log("There was an error: "+e)
                apps.uninstallApp(app)
            })
        }).catch(e => {
            if(e) console.log("There was an error: "+e)
            else console.log("DockerApp "+appname+" not found!")
        })
    }
}

module.exports = installCommand