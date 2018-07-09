const execSync = require('child_process').execSync

class DockerRunner {
    constructor(){
        this.capabilities = []
        this.volumes = []
        this.environment = []
    }

    addCapability(capability){
        this.capabilities.push(capability)
    }

    addVolumes(volumes, basedir){
        if(volumes) for(let volume of volumes){
            if(basedir) volume.host = basedir + volume.host
            this.volumes.push(volume)
        }
    }

    addEnvironment(environment){
        if(environment) for(let field of environment){
            this.environment.push(field)
        }
    }

    buildDockerString(){
        let ret = []
        for(let volume of this.volumes){
            ret.push("--volume="+volume.host+":"+volume.container+(volume.options ? ":"+volume.options : ""))
        }
        for(let field of this.environment){
            ret.push("--env='"+field.name+"="+field.value+"'")
        }
        return ret.join(" ")
    }

    run(name){
        for(let capability of this.capabilities){
            capability.preRun()
            let options = capability.getRunOptions()
            this.addVolumes(options.volumes)
            this.addEnvironment(options.environment)
        }
        let dockerOptionsString = this.buildDockerString()
        console.log("docker run "+dockerOptionsString+" "+name)
        execSync("docker run "+dockerOptionsString+" "+name)
    }

    build(target, folder, verbose = false){
        execSync("cd "+folder+" && docker build -t "+target+" .", verbose ? {stdio:[0,1,2]} : {})
    }
}


module.exports = DockerRunner