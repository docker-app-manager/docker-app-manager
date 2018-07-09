const hostinfo = require("../utils/hostinfo.js")

class PulseCapability{
    constructor(app){
        this.app = app
    }

    preRun(){

    }
    
    getRunOptions(){
        return {
            volumes: [
                {
                    host: "/run/user/"+hostinfo.getUid()+"/pulse",
                    container: "/run/user/"+hostinfo.getUid()+"/pulse"
                }
            ]
        }
    }

    postRun(){

    }
}

module.exports = PulseCapability