var axios = require('axios');
var https = require('https');
var fs = require('fs');


function request(url, payload, method, headers, cert, callback) {
    if (!url || url === '') {
        if (typeof callback === 'function') callback('no url specified');
        return;
    }

    var options = {
        method: method === 'GET' ? 'GET' : 'POST',
        url: url,
        rejectUnauthorized: false,
        headers: {
            'Accept': 'application/vnd.neato.nucleo.v1'
        }
    };

    if (options.method === 'POST') {
        options.data = payload;
    }

    if (typeof headers === 'object') {
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                options.headers[header] = headers[header];
            }
        }
    }

    if (cert) {
        options.httpsAgent = new https.Agent(
            {   
                rejectUnauthorized: false,
                keepAlive : true,
                ca: fs.readFileSync(cert) 
            }
        )
    }

    let res, err;
    
    axios(options)
    .then(function (response) {
        res = response.data;
    })
    .catch(function (error) {
        err = error;
    })
    .finally(function () {
        // Callback needs to be called in finally block, see: https://github.com/Pmant/node-botvac/issues/15
        if (typeof callback === 'function') callback(err, res);
    });
}

exports.request = request;
