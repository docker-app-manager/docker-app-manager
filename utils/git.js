const execSync = require('child_process').execSync

function cloneBranchToFolder(repo, branch, folder){
    execSync("git clone "+
    "--single-branch -b "+branch+" "+
    repo+" "+folder)
}

function pullRepo(folder, branch = "master"){
    execSync("cd "+folder+" && git pull origin "+ branch)
}


module.exports = {
    cloneBranchToFolder: cloneBranchToFolder,
    pullRepo: pullRepo
}