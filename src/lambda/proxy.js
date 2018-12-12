const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.get('*', async (req, res) => {
  const { originalUrl } = req;
  const endpoint = originalUrl.replace('/proxy', '');

  try {
    const response = await axios.get(`https://api.genius.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`
      }
    });

    res.send(response.data);
  } catch (error) {
    console.error("ERROR", error);
    res.send(error.message);
  }
});

module.exports.handler = serverless(app);