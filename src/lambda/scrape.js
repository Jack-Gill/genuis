const axios = require("axios");
const cheerio = require("cheerio");
const { Translate } = require("@google-cloud/translate");

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

exports.handler = async (event, context) => {
    const {
        GOOGLE_CLIENT_EMAIL,
        GOOGLE_PRIVATE_KEY,
    } = process.env;
    const projectId = "Genuis";
    const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    // Instantiates a translate client
    const translate = new Translate({
        credentials: {
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: privateKey
        },
        projectId
    });

    // The target language
    const firstTarget = "ja";
    const secondTarget = "en";

    const { path, songId } = event.queryStringParameters;
    const lyricsData = await scrapeContent(path);

    let lyricsText = lyricsData.map(({ text }) => text);

    try {
        let translationResults = await translate.translate(lyricsText, firstTarget);
        // Result of a translate call is always an array, the first item of which is the translated text/texts
        let translatedLyrics = translationResults[0];

        translationResults = await translate.translate(translatedLyrics, secondTarget);
        translatedLyrics = translationResults[0];

        translatedLyrics.forEach((result, index) => {
            lyricsData[index].text = result;
        });
    } catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
    
    const body = { lyricsData };

    return {
        statusCode: 200,
        body: JSON.stringify(body)
    };
};
