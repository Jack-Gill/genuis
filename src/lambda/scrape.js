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
    const lyrics = $(".lyrics p");
    const children = lyrics.contents();

    const lyricsData = [];

    children.map((_, element) => {
        const el = $(element);
        if (el[0].name === "br") return;

        const data = el[0].data;
        if (data && data.startsWith("\n")) {
            const newData = data.replace("\n", "").trim();
            if (newData === "") return;
        }

        const lyric = {
            text: el.text().trim(),
            referentId: el.data("id")
        };

        lyricsData.push(lyric);
    });

    res.send({
        lyricsData
    });
});

module.exports.handler = serverless(app);
