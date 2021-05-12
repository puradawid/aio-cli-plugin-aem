const BaseCommand = require("../../../base-command");
const AemApi = require('../../../http/api');
const Connection = require('../../../http/connection').http;
const config = require('../../../config/reader');
const PackMgr = require('../../../http/packmgr/base');

class Activate extends PackMgr {
    doRun({args, flags}) {
        const packageArg = args.package.split(':');
        const aemPackage = AemApi.Package(packageArg[0], packageArg[1], packageArg[2]);
        const instance = config.readConfig();
        const aemEnv = flags.env ? flags.env : 'local';

        try {
            AemApi.packMgr.activate(new Connection(instance[aemEnv].host,
                instance[aemEnv].port,
                instance[aemEnv], flags), aemPackage);
        } catch (error) {
            console.log(error);
        }
    }
}

Activate.description = "This is the command that allows used to manage packmgr"

Activate.args = [...PackMgr.args];

Activate.flags = Object.assign({}, PackMgr.flags);

Activate.examples = [
    "aem:packmgr:activate my_packages:my_package:0.0.1"
]

module.exports = {
    activate: Activate
}