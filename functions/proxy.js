const axios = require('axios');

const proxyRequest = (url, params) => {
    console.log(`Proxy Request for ${url} with params: ${params}`);

    return axios.get(`https://api.genius.com${url}`, {
        headers: {
            Authorization: `Bearer ${process.env.AUTH_TOKEN}`
        },
        params
    });
};

exports.proxyRequest = proxyRequest;
