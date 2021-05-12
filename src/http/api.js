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

const validatePackage = (pkg, callback) => {
    if (pkg.name && pkg.group) {
        callback();
    } else {
        throw new Error(`Cannot instantiate this package ${JSON.stringify(pkg)}`);
    }
}

const packMgr = {
    activate: function (conn, pkg) {
        validatePackage(pkg, () => {
            const path = `/crx/packmgr/service/script.html/etc/packages/` + 
                `${pkg.group}/${pkg.name}${pkg.version ? '-' + pkg.version : ''}.zip`;
            conn.post(path, {
                cmd: 'replicate'
            }).then((response) => {
                if (response.status === 200) {
                    console.log("Replication finished succesfully");
                    console.log(response.data);
                } else {
                    throw new Error(`There is a problem with fulfilling the request (statusCode: ${response.status}),` +
                        ` here's the response: \n ${response.data}` + response.data);
                }
            }).catch((err) => {
                throw new Error("Unexpected error occured: " + err);
            });
        });
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