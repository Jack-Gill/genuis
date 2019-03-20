const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const { Translate } = require("@google-cloud/translate");
const projectId = "Genuis";

const app = express();
app.use(bodyParser.json());

app.get("*", async (req, res) => {
    const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
    // Instantiates a client
    const translate = new Translate({ credentials, projectId });

    // The target language
    const firstTarget = "ja";
    const secondTarget = "en";

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

    let promiseArray = lyricsData.map(({ text }) => {
        return translate.translate(text, firstTarget);
    });

    let results = await Promise.all(promiseArray);

    results.forEach((result, index) => {
        lyricsData[index].text = result[0];
    });

    promiseArray = lyricsData.map(({ text }) => {
        return translate.translate(text, secondTarget);
    });

    results = await Promise.all(promiseArray);

    results.forEach((result, index) => {
        lyricsData[index].text = result[0];
    });

    res.send({
        lyricsData
    });
});

module.exports.handler = serverless(app);
