function damCommand(action){
    let args = Array.prototype.slice.call(arguments, 1);
    switch(action){
        case "update":
            require("./update.js")(...args)
            break;
        case "install":
            require("./install.js")(...args)
            break;
        case "upgrade":
            require("./upgrade.js")(...args)
            break; 
        case "uninstall":
            require("./uninstall.js")(...args)
            break;
        case "run":
            require("./run.js")(...args)
            break;
        default:
            console.log(`Usage:
./dam update            Update the locals apps list repositories with the remotes one
./dam install <app>     Install <app>
./dam run <app>         Run <app>
./dam uninstall <app>   Uninstall <app>
./dam upgrade <app>     Upgrade <app>`)
    }
}

module.exports = damCommand