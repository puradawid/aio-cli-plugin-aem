/*
  This module provides two types of connection object based on a use case:
  - FakeConnection, which records all calls and exposes it by an additional
    property "requests"
  - HttpConnection, Axios wrapper that sends actual HTTP(S) requests to
    some remote service, based on additional configuration object
  Both these services should have the same methods used in dependent modules
  for handling business cases. If one changes the behavior in one of them,
  must change verify the need to apply any changes to the other one.
*/

const FakeConnection = function (init) {
    this.requests = init ? init : [];
    this.response = {
        status: 200,
        data: "OK"
    }

    this.get = function () {
        this.requests.push({method: 'GET', arguments: arguments});
    }

    this.post = function (path, form) {
        this.requests.push({method: 'POST', arguments: {
            path: path,
            form: form
        }});
        return new Promise((resolve) => {
            resolve(this.response);
        })
    }
}

const FormData = require('form-data'),
https = require('https'),
axios = require('axios');

const HttpConnection = function (host, port, auth, options) {

    let axiosInstance;

    if (options && options.unsafeSsl) {
        axiosInstance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    } else {
        axiosInstance = axios.create();
    }

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
        const form = formDataToForm(query);
        try {
            const result = await new Promise((resolve, reject) => {
                const protocol = port == '443' ? 'https' : 'http';
                const options = {
                    url: `${protocol}://${host}:${port}${path}`,
                    method: 'post',
                    auth: {
                        username: auth.username,
                        password: auth.password
                    }
                }
                if (query) {
                    options.headers = form.getHeaders()
                    options.data = form
                }
                axiosInstance(options).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                })
            });
            return {
                status: result.status,
                data: result.data
            }
        } catch (error) {
            if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
                console.log("There is an issue with SSL certificate, consider using --unsafeSsl if you are using self-signed SSL cert");
            } else {
                console.log(error);
            }
        }
    }
}

module.exports = {
    fake: FakeConnection,
    http: HttpConnection
}