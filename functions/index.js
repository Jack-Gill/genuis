// Require'd modules
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const { Translate } = require("@google-cloud/translate");

// variable initialization
const TOO_MANY_SEGMENTS_MESSAGE = "Too many text segments";
const projectId = "Genuis";
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const scrapeContent = async path => {
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
        if (el[0].name === "br") return null;

        const data = el[0].data;
        if (data && data.startsWith("\n")) {
            const newData = data.replace("\n", "").trim();
            if (newData === "") return null;
        }

        const lyric = {
            text: el.text().trim(),
            referentId: el.data("id")
        };

        lyricsData.push(lyric);
    });

    return lyricsData;
};

exports.scrape = functions.https.onRequest(async (request, res) => {
    const docRef = db.collection("users").doc("alovelace");

    const setAda = docRef.set({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    });
    // Instantiates a translate client
    const translate = new Translate({
        projectId
    });

    // The target language
    const firstTarget = "ja";
    const secondTarget = "en";

    const { path } = request.query;
    let lyricsData = await scrapeContent(path);
    let retry = false;

    do {
        let lyricsText = lyricsData.map(({ text }) => text);

        try {
            let translationResults = await translate.translate(
                lyricsText,
                firstTarget
            );
            // Result of a translate call is always an array, the first item of which is the translated text/texts
            let translatedLyrics = translationResults[0];

            translationResults = await translate.translate(
                translatedLyrics,
                secondTarget
            );
            translatedLyrics = translationResults[0];

            translatedLyrics.forEach((result, index) => {
                lyricsData[index].text = result;
            });
            retry = false;
        } catch (err) {
            if (err.message === TOO_MANY_SEGMENTS_MESSAGE) {
                lyricsData = lyricsData.slice(0, 99);
                lyricsData.push({ text: "(song is too long)" });
                retry = true;
            } else {
                res.send(err);
            }
        }
    } while (retry);

    res.send(lyricsData);
});

exports.proxy = functions.https.onRequest(async (request, res) => {
    const { params, originalUrl } = request;
    //TODO: get correct endpoint

    try {
        const response = await axios.get(
            `https://api.genius.com${originalUrl}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_TOKEN}`
                },
                params: params
            }
        );

        res.send(response.data);
    } catch (error) {
        console.error("ERROR", error);
        res.send(error.message);
    }
});
