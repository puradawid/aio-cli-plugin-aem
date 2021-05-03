const FakeConnection = function (init) {
    this.requests = init ? init : [];

    this.get = function () {
        this.requests.push({method: 'GET', arguments: arguments});
    }

    this.post = function (path, query, form) {
        this.requests.push({method: 'POST', arguments: {
            path: path,
            query: query,
            form: form
        }});
    }
}

const http = require('http'),
FormData = require('form-data');

const HttpConnection = function (host, auth) {
    const formDataToForm = function (form) {
        if (form) {
            const result = new FormData();
            Object.keys(form).map(x => {
                if (typeof form[x] === 'string') {
                    return {
                        param: x,
                        value: form[x]
                    }
                }
            }).forEach(x => {
                result.append(x.param, x.value);
            })
            return result;
        }
    }

    this.post = async function (path, query) {
        //const form = formDataToForm(formData);
        try {
            const result = await new Promise((resolve, reject) => {
                const req = http.request({
                    method: 'post',
                    path: `${path}${query ? '?' + query : ''}`,
                    auth: auth,
                    host: host,
                    //headers: form.getHeaders()
                });
        
                //form.pipe(req);

                req.on('end', (err) => {
                    resolve(err);
                })

                req.on('error', (err) => {
                    reject(err);
                })
        
                req.end();
            })
        } catch (error) {
            console.log(error);
        }
       
    }
}

module.exports = {
    fake: FakeConnection,
    http: HttpConnection
}