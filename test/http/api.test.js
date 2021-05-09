const Connection = require('../../src/http/connection').fake;
const aemApi = require('../../src/http/api');

describe('PackManager', () => {
    describe('Activate', () => {
        let conn;

        beforeEach(() => {
            conn = new Connection();
        })

        test('with proper parameters', () => {
            const activatePackage = aemApi.Package('my_packages', 'my_package', '0.0.1');

            aemApi.packMgr.activate(conn, activatePackage);

            expect(conn.requests[0].method).toEqual('POST');
            expect(conn.requests[0].arguments.path).toEqual('/crx/packmgr/service/script.html/etc/packages/my_packages/my_package-0.0.1.zip');
            expect(conn.requests[0].arguments.form).toEqual({cmd: 'replicate'});
        });

        test('with unversioned package', () => {
            const activatePackage = aemApi.Package('my_packages', 'my_unversioned_package');

            aemApi.packMgr.activate(conn, activatePackage);

            expect(conn.requests[0].method).toEqual('POST');
            expect(conn.requests[0].arguments.path)
                .toEqual('/crx/packmgr/service/script.html/etc/packages/my_packages/my_unversioned_package.zip');
            expect(conn.requests[0].arguments.form).toEqual({cmd: 'replicate'});
        });

        test('with broken package object', () => {
            const activatePackage = aemApi.Package('my_package');

            expect(() => {
                aemApi.packMgr.activate(conn, activatePackage);
            }).toThrow();
        })
    });
});