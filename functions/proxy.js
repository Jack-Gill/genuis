const axios = require('axios');
const functions = require("firebase-functions");

const proxyRequest = (url, params) => {
    console.log(`Proxy Request for ${url} with params: ${params}`);

    return axios.get(`https://api.genius.com${url}`, {
        headers: {
            Authorization: `Bearer ${functions.config().genius.auth_token}`
        },
        params
    });
};

exports.proxyRequest = proxyRequest;
