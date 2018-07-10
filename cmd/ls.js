const fs = require("fs-extra")
const config = require("../lib/config.js")

function lsCommand(){
    let apps = fs.readdirSync(config.dam_apps_home)
    console.log("Installed DockerApps: \n"+apps.join("\n"))
}


module.exports = lsCommand