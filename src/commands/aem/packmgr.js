const BaseCommand = require("../../base-command");
const AemApi = require('../../http/api');
const Connection = require('../../http/connection').http;

class PackMgr extends BaseCommand {
    doRun({args}) {
        const packageArg = args.package.split(':');
        const aemPackage = AemApi.Package(packageArg[0], packageArg[1], packageArg[2]);

        console.log(JSON.stringify(aemPackage));

        try {
            AemApi.packMgr.activate(new Connection('localhost', 'admin:admin'), aemPackage);
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