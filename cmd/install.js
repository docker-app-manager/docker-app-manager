const repos = require("../lib/repos.js")
const apps = require("../lib/apps.js")

function installCommand(appname){
    const args = require("minimist")(Array.prototype.slice.call(arguments))
    if(args.d){
        apps.installDirectory(args.d).then(app => {
            console.log("DockerApp "+app.name+" installed!")
        })
    } else if(!args.d && args._[0]) {
        let appname = args._[0]
        repos.getApp(appname).then(app => {
            //TODO: check if app is installed
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
    } else {
        console.log(`./dam install -d <source directory> <app name>
Examples:
./dam install myapp
./dam install -d /path/to/myapp`)
    }
}

module.exports = installCommand