const fs = require("fs-extra")
const execSync = require('child_process').execSync

function installDesktopFile(file){
    let filesplit = file.split("/")
    let fname = filesplit[filesplit.length - 1]
    if(fs.existsSync("/usr/share/applications/"+fname))
        execSync("sudo rm /usr/share/applications/"+fname)
    execSync("sudo cp "+file+" /usr/share/applications/")
}

function uninstallDesktopFile(appname){
    let file = "/usr/share/applications/dam-"+appname+".desktop"
    if(fs.existsSync(file))
        execSync("sudo rm "+file)
}


module.exports = {
    installDesktopFile: installDesktopFile,
    uninstallDesktopFile: uninstallDesktopFile
}