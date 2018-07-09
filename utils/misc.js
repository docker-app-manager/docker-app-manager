const fs = require("fs")
const path = require("path")
const execSync = require('child_process').execSync


function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(entry => {
            var entry_path = path.join(dir_path, entry)
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path)
            } else {
                fs.unlinkSync(entry_path)
            }
        })
        fs.rmdirSync(dir_path)
    }
}


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
    rimraf: rimraf,
    installDesktopFile: installDesktopFile,
    uninstallDesktopFile: uninstallDesktopFile
}