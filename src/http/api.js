/*
  This module describes all configuration and actions needed for
  AEM inteactions. At this level, code should verify the correctness
  of response, parameters (and validate them) and handle all expected
  error which comes from AEM (but not from connection's behavior).

  To write additional function to this class, one must write a test
  which checks all known interactions with AEM instance, describes potential
  parameters and checks them against fake connections.
  See src/test/commands/http/api.test.js.
*/

const Package = function (group, name, version, filters) {
    return {
        name: name,
        group: group,
        version: version,
        filters: filters
    }
}

const validateBasePackage = function (pkg) {
    return pkg.name && pkg.group;
}

const packMgr = {
    activate: function (conn, pkg) {
        if (validateBasePackage(pkg)) {
            const path = `/crx/packmgr/service/script.html/etc/packages/${pkg.group}/${pkg.name}${pkg.version ? '-' + pkg.version : ''}.zip`;
            conn.post(path, {
                cmd: 'replicate'
            });
        } else {
            throw new Error(`Cannot instantiate this package ${JSON.stringify(pkg)}`);
        }
    },
    create: function () {
        
    },
    modify: function () {

    },
    delete: function () {

    },
    install: function () {

    },
    rebuild: function () {

    }
};

module.exports = {
    Package: Package,
    packMgr: packMgr
};