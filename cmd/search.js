const repos = require("../lib/repos.js")

function searchCommand(re){
    repos.searchApp(re).then(apps => {
        if(apps.length > 0)
            console.log("Results: \n"+
            apps.map(app => app.name+" - "+app.description)
            .join("\n"))
        else
            console.log("No results")
    })
}


module.exports = searchCommand