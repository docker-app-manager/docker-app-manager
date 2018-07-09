const fs = require("fs")
const config = require("./config.js")
const git = require("../utils/git.js")

function getUserRepos(){
    // TODO: use $HOME/.dam/sources.json instead
    return new Promise((res, rej) => {
        res(
            [
                {
                    name: "dam-official",
                    git: "https://github.com/docker-app-manager/docker-app-repository.git"
                }
            ])
    })
}


function updateAll(){
    return new Promise(async (res, rej) => {
        if(!fs.existsSync(config.dam_home))
            fs.mkdirSync(config.dam_home)
        let repohome = config.dam_home+"repositories/"
        if(!fs.existsSync(repohome))
            fs.mkdirSync(repohome)

        let repos = await getUserRepos()
        for(let repo of repos){
            if(fs.existsSync(repohome+repo.name)){
                console.log("Updating existing "+repo.name)
                git.pullRepo(repohome+repo.name)
            }
            else{
                console.log("Creating new "+repo.name)
                git.cloneBranchToFolder(repo.git, "master", repohome+repo.name)
            }
        }
        res()
    })
}

function getAll(){
    return new Promise((res, rej) => {
        let repohome = config.dam_home+"repositories/"
        let ret = []
        fs.readdir(repohome, (err, repos) => {
            for(let repo of repos){
                apps = JSON.parse(fs.readFileSync(repohome+repo+"/repository.json"))
                for(let appname in apps){
                    ret.push(apps[appname])
                }
            }
            res(ret)
        })
    })
}

function getApp(name){
    return new Promise(async (res, rej) => {
        let apps = await getAll()
        for(let app of apps){
            if(app.name == name){
                res(app)
                return
            }
        }
        rej()
    })
}

module.exports = {
    getUserRepos: getUserRepos,
    updateAll: updateAll,
    getAll: getAll,
    getApp: getApp
}