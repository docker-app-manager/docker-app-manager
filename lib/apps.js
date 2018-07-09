const fs = require("fs")
const config = require("./config.js")
const DockerRunner = require("../core/docker.js")
const capabilities = require("./capabilities.js")
const git = require("../utils/git.js")
const hostinfo = require("../utils/hostinfo.js")
const misc = require("../utils/misc.js")

function installApp(app){
    return new Promise((res, rej) => { 
        if(!fs.existsSync(config.dam_apps_home))
            fs.mkdirSync(config.dam_apps_home)

        if(fs.existsSync(config.dam_apps_home+app.name))
            throw new Error("Install destination exists");
        
        let repo = app.git.split("#")[0]
        let branch = app.git.split("#")[1] || "master"
        git.cloneBranchToFolder(repo, branch, config.dam_apps_home+app.name)
        createDockerFile(app)
        buildDocker(app)

        fs.mkdirSync(config.dam_apps_home+app.name+"/Volumes")
        processDesktopFile(app)
        res()
    })
}

function upgradeApp(app){
    return new Promise((res, rej) => {
        if(!fs.existsSync(config.dam_apps_home) || !fs.existsSync(config.dam_apps_home+app.name))
            throw new Error("App not installed")
        let branch = app.git.split("#")[1] || "master"
        git.pullRepo(config.dam_apps_home+app.name, branch)
        createDockerFile(app)
        buildDocker(app)
        processDesktopFile(app)
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
            misc.rimraf(config.dam_apps_home+app.name)
            if(dockerapp['desktop-file']){
                console.log("Uninstalling desktop file with sudo")
                misc.uninstallDesktopFile(app.name)
            }
            res()
        }
    })
}


function createDockerFile(app){
    let dockerapp = fs.readFileSync(config.dam_apps_home+app.name+"/DockerApp").toString()
    dockerapp = evalVars(dockerapp)
    fs.writeFileSync(config.dam_apps_home+app.name+"/Dockerfile", dockerapp)
}

function buildDocker(app){
    dockerRunner = new DockerRunner()
    dockerRunner.build("dockerapp_"+app.name, config.dam_apps_home+app.name, true)
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


function runApp(app){
    let dockerapp
    try{
        dockerapp = JSON.parse(fs.readFileSync(config.dam_apps_home+app.name+"/dockerapp.json").toString())
    } catch (e) {
        console.log("dockerapp.json not found or invalid: "+e)
        return
    }
    
    let dockerRunner = new DockerRunner()
    for(capabilityname of dockerapp.capabilities){
        let capability = capabilities.getCapability(capabilityname, dockerapp)
        if(capability) dockerRunner.addCapability(capability)
    }
    
    dockerRunner.addVolumes(dockerapp['app-volumes'], config.dam_apps_home+app.name+"/Volumes/")

    dockerRunner.run("dockerapp_"+app.name)
}


function processDesktopFile(app){
    let dockerapp
    try{
        dockerapp = JSON.parse(fs.readFileSync(config.dam_apps_home+app.name+"/dockerapp.json").toString())
    } catch (e) {
        console.log("dockerapp.json not found or invalid: "+e)
        return
    }
    if(dockerapp['desktop-file']){
        let desktopfile = fs.readFileSync(config.dam_apps_home+app.name+"/"+dockerapp['desktop-file']).toString()
        desktopfile = evalVars(desktopfile)
        let filename = "/tmp/dam-"+app.name+".desktop"
        fs.writeFileSync(filename, desktopfile)
        console.log("Created desktop file: "+filename)
        console.log("Trying to install it with sudo")
        misc.installDesktopFile(filename)
    }
}

module.exports = {
    installApp: installApp,
    upgradeApp: upgradeApp,
    uninstallApp: uninstallApp,
    runApp: runApp
}