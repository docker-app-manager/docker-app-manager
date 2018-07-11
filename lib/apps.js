const fs = require("fs-extra")
const config = require("./config.js")
const DockerRunner = require("../core/docker.js")
const capabilities = require("./capabilities.js")
const git = require("../utils/git.js")
const hostinfo = require("../utils/hostinfo.js")
const misc = require("../utils/misc.js")

function installApp(app){
    return new Promise((res, rej) => { 
        createAppDir(app.name)

        let repo = app.git.split("#")[0]
        let branch = app.git.split("#")[1] || "master"
        git.cloneBranchToFolder(repo, branch, config.dam_apps_home+app.name)

        dockerapp = getDockerApp(app.name)

        createDockerFile(dockerapp)
        buildDocker(dockerapp)

        fs.mkdirSync(config.dam_apps_home+dockerapp.name+"/Volumes")
        processDesktopFile(dockerapp)
        res(dockerapp)
    })
}

function installDirectory(dir){
    return new Promise((res, rej) => {
        let dockerapp
        try{
            dockerapp = JSON.parse(fs.readFileSync(dir+"/dockerapp.json").toString())
        } catch (e) {
            throw new Error("dockerapp.json not found or invalid: "+e.message)
        }

        createAppDir(dockerapp.name)
        fs.copySync(dir, config.dam_apps_home+dockerapp.name)
        createDockerFile(dockerapp)
        buildDocker(dockerapp)

        fs.mkdirSync(config.dam_apps_home+dockerapp.name+"/Volumes")
        processDesktopFile(dockerapp)
        res(dockerapp)
    })
}

function getDockerApp(appname){
    try{
        return JSON.parse(fs.readFileSync(config.dam_apps_home+appname+"/dockerapp.json").toString())
    } catch (e) {
        throw new Error("dockerapp.json not found or invalid: "+e.message)
    }
}

function createAppDir(dir){
    if(!fs.existsSync(config.dam_apps_home))
        fs.mkdirSync(config.dam_apps_home)

    if(fs.existsSync(config.dam_apps_home+dir))
        throw new Error("Install destination exists");
}

function upgradeApp(app){
    return new Promise((res, rej) => {
        if(!fs.existsSync(config.dam_apps_home) || !fs.existsSync(config.dam_apps_home+app.name))
            throw new Error("App not installed")
        let branch = app.git.split("#")[1] || "master"
        git.pullRepo(config.dam_apps_home+app.name, branch)
        
        dockerapp = getDockerApp(app.name)

        createDockerFile(dockerapp)
        buildDocker(dockerapp)
        processDesktopFile(dockerapp)
        res()
    })
}

function uninstallApp(app){
    return new Promise((res, rej) => {
        if(!fs.existsSync(config.dam_apps_home) || !fs.existsSync(config.dam_apps_home+app.name))
            throw new Error("App not installed")
        else{
            let dockerapp
            try{
                dockerapp = JSON.parse(fs.readFileSync(config.dam_apps_home+app.name+"/dockerapp.json").toString())
            } catch (e) {
                console.log("dockerapp.json not found or invalid: "+e)
                return
            }
            fs.removeSync(config.dam_apps_home+app.name)
            if(dockerapp['desktop-file']){
                console.log("Uninstalling desktop file with sudo")
                misc.uninstallDesktopFile(app.name)
            }
            res()
        }
    })
}


function createDockerFile(dockerapp){
    let dockerappfile = fs.readFileSync(config.dam_apps_home+dockerapp.name+"/DockerApp").toString()
    dockerappfile = evalVars(dockerappfile)
    fs.writeFileSync(config.dam_apps_home+dockerapp.name+"/Dockerfile", dockerappfile)
}

function buildDocker(dockerapp){
    dockerRunner = new DockerRunner()
    dockerRunner.build("dockerapp_"+dockerapp.name, config.dam_apps_home+dockerapp.name, true)
}


function evalVars(str){
    let uid = hostinfo.getUid()
    let gid = hostinfo.getGid()
    str = str.replace(/\$DAM_USERNAME/g, "dockerapp")
    str = str.replace(/\$DAM_UID/g, uid)
    str = str.replace(/\$DAM_GID/g, gid)
    str = str.replace(/\$DAM_PATH/g, hostinfo.getDamPath())
    return str
}


function runApp(appname, args){
    if(!fs.existsSync(config.dam_apps_home+appname))
        throw new Error(appname+ "is not installed!")
    let dockerapp = getDockerApp(appname)
    let dockerRunner = new DockerRunner()
    for(capabilityname of dockerapp.capabilities){
        let capability = capabilities.getCapability(capabilityname, dockerapp)
        if(capability) dockerRunner.addCapability(capability)
    }
    
    dockerRunner.addVolumes(dockerapp['app-volumes'], config.dam_apps_home+dockerapp.name+"/Volumes/")
    dockerRunner.addArguments(args)
    dockerRunner.run("dockerapp_"+dockerapp.name)
}


function processDesktopFile(dockerapp){
    if(dockerapp['desktop-file']){
        let desktopfile = fs.readFileSync(config.dam_apps_home+dockerapp.name+"/"+dockerapp['desktop-file']).toString()
        desktopfile = evalVars(desktopfile)
        let filename = "/tmp/dam-"+dockerapp.name+".desktop"
        fs.writeFileSync(filename, desktopfile)
        console.log("Created desktop file: "+filename)
        console.log("Trying to install it with sudo")
        misc.installDesktopFile(filename)
    }
}

module.exports = {
    installApp: installApp,
    installDirectory: installDirectory,
    upgradeApp: upgradeApp,
    uninstallApp: uninstallApp,
    runApp: runApp
}