// Require'd modules
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const { Translate } = require("@google-cloud/translate");

// require'd local modules
const { proxyRequest } = require("./proxy");

// variable initialization
const TOO_MANY_SEGMENTS_MESSAGE = "Too many text segments";
const projectId = "Genuis";
// The target language
const firstTarget = "ja";
const secondTarget = "en";

// Instantiates a translate client
const translate = new Translate({
    projectId
});

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

async function scrapeContent(path) {
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
            referentId: el.data("id") || null
        };

        lyricsData.push(lyric);
    });

    return lyricsData;
}

async function translateSongLyrics(lyricsData) {
    let lyricsDataCopy = lyricsData;
    let retry = false;

    do {
        let lyricsText = lyricsDataCopy.map(({ text }) => text);

        try {
            // eslint-disable-next-line
            let translationResults = await translate.translate(
                lyricsText,
                firstTarget
                );
                // Result of a translate call is always an array, the first item of which is the translated text/texts
                let translatedLyrics = translationResults[0];
                
            // eslint-disable-next-line
            translationResults = await translate.translate(
                translatedLyrics,
                secondTarget
                );
                translatedLyrics = translationResults[0];
                
            // eslint-disable-next-line
            translatedLyrics.forEach((result, index) => {
                lyricsDataCopy[index].text = result;
            });
            retry = false;
        } catch (err) {
            if (err.message === TOO_MANY_SEGMENTS_MESSAGE) {
                lyricsDataCopy = lyricsDataCopy.slice(0, 99);
                lyricsDataCopy.push({ text: "(song is too long)" });
                retry = true;
            } else {
                throw err;
            }
        }
    } while (retry);

    return lyricsDataCopy;
}

exports.getWarpedSong = functions.https.onRequest(async (request, res) => {
    const { songId } = request.query;
    // attempt to get songId out of firebase
    const songDocRef = db.collection("songs").doc(songId);

    console.log("GET WARPED SONG");

    let responseObj = {};

    songDocRef
        .get()
        .then(async doc => {
            console.log("RESOLVED REQUEST FOR DOC");

            // if song with matching id exists
            if (doc.exists) {
                console.log("DOC EXISTS");

                // if warped version exists.
                const { original, warped, name } = doc.data();
                if (warped) {
                    console.log("HAS WARPED");
                    // return it
                    res.send({ name, warped });
                    return;
                } else if (original) {
                    // translate to warped version
                    const warped = await translateSongLyrics(original);
                    // store in firebase
                    songDocRef.set({
                        name,
                        original,
                        warped
                    });
                    // return it
                    res.send({
                        name,
                        warped
                    });
                    return;
                }
            } else {
                console.log("DOC DOES NOT EXIST");

                // else
                // scrape it to get original
                const { data } = await proxyRequest(`/songs/${songId}`, {});
                const song = data.response.song;
                console.log("GOT DATA");

                const path = song.path;
                const originalLyrics = await scrapeContent(path);
                console.log("ORIGINAL LYRICS");

                // translate to warped version
                const warpedLyrics = await translateSongLyrics(originalLyrics);
                console.log("WARPED LYRICS", warpedLyrics);

                // store in firebase
                try {
                    songDocRef.set({
                        name: song.primary_artist.name,
                        original: originalLyrics,
                        warped: warpedLyrics
                    });
                } catch (err) {
                    console.log(err);
                }
                // return it
                res.send({
                    name: song.primary_artist.name,
                    warped: warpedLyrics
                });
                return;
            }
            return;
        })
        .catch(err => {
            res.send(err);
        });
});

const proxy = functions.https.onRequest(async (request, res) => {
    const { params, originalUrl } = request;
    //TODO: get correct endpoint

    try {
        const response = await proxyRequest(originalUrl, params);
        res.send(response.data);
    } catch (error) {
        console.error("ERROR", error);
        res.send(error.message);
    }
});

exports.proxy = proxy;
