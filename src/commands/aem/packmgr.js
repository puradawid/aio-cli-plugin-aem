const BaseCommand = require("../../base-command");
const AemApi = require('../../http/api');
const Connection = require('../../http/connection').http;
const config = require('../../config/reader');

const {flags} = require('@oclif/command')

class PackMgr extends BaseCommand {
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

PackMgr.description = "This is the command that allows used to manage packmgr"

PackMgr.args = [
    {
        name: 'action',
        required: true,
        hidden: false,
        description: "action, i.e. replicate, install, rebuild, upload, download"
    },
    {
        name: 'package',
        required: true,
        hidden: false,
        description: "colon separated group:name:version of the pacakge, e.g. my_package:my_packages:0.0.1-SNAPHOST"
    }
]
 
PackMgr.flags = Object.assign({}, BaseCommand.flags, {
    env: flags.string({
        char: 'e',
        description: 'Name of environment from configuration',
        default: 'local'
    }),
    unsafeSsl: flags.boolean({
        description: 'Ignore problems with self-signed SSL certificate'
    })
});

PackMgr.examples = [
    "aem:packmgr upload my_packages:my_package:0.0.1 -f package.zip",
    "aem:packmgr install my_packages:my_package:0.0.1",
    "aem:packmgr activate my_packages:my_package:0.0.1",
    "aem:packmgr rebuild my_packages:my_package:0.0.1",
    "aem:packmgr download my_packages:my_package:0.0.1 -f package.zip"
]

module.exports = {
    packmgr: PackMgr
}