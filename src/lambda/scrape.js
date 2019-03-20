const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(bodyParser.json());

app.get("*", async (req, res) => {
    const { path } = req.query;
    const pageHtml = await axios
        .get(`https://genius.com${path}`)
        .then(({ data }) => {
            return data;
        });

    const $ = cheerio.load(pageHtml);

    const lyrics = $(".lyrics");
    console.log(lyrics);
    res.send({
        lyricsHtml: lyrics.toString()
    });
});

module.exports.handler = serverless(app);
