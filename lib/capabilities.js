function getCapability(name, app){
    switch(name){
        case "x":
            return new (require("../capabilities/x.js"))(app)
        case "pulse":
            return new (require("../capabilities/pulse.js"))(app)
        default:
            console.log("Unknown capability: "+name)
            return null
    }
}

module.exports = {
    getCapability: getCapability
}