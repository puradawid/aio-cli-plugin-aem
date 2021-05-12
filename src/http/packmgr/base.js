const BaseCommand = require('../../base-command');

const {flags} = require('@oclif/command');

class PackMgr extends BaseCommand {

}

PackMgr.args = [
    {
        name: 'package',
        required: true,
        hidden: false,
        description: "colon separated group:name:version of the pacakge, e.g. my_package:my_packages:0.0.1-SNAPHOST"
    }
];

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

module.exports = PackMgr;