const execSync = require('child_process').execSync

class XCapability {
    constructor(app){
        this.app = app
        this.xauth = "/tmp/.dockerapp."+this.app.name+".xauth"
        this.xsock = "/tmp/.X11-unix"
    }
    preRun(){
        execSync("touch "+this.xauth)
        execSync("xauth nlist $DISPLAY | sed -e 's/^..../ffff/' | xauth -f "+this.xauth+" nmerge -")
    }

    getRunOptions(){
        return {
            volumes: [
                {
                    host: this.xsock,
                    container: this.xsock,
                    options: "rw"
                },
                {
                    host: this.xauth,
                    container: this.xauth,
                    options: "rw"
                }
            ],
            environment: [
                {
                    name: "XAUTHORITY",
                    value: this.xauth
                },
                {
                    name: "DISPLAY",
                    value: process.env.DISPLAY
                }
            ]
        }
    }

    postRun(){

    }
}


module.exports = XCapability