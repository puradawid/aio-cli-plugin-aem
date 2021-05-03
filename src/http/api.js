const Package = function (name, group, version, filters) {
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
            conn.post(`/crx/packmgr/service/script.html/etc/packages/${pkg.group}/${pkg.name}${pkg.version ? '-' + pkg.version : ''}.zip`);
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