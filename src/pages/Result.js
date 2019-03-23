import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "constants.js";
import styled from "styled-components";

const Referent = styled.a`
    display: inline;
    background-color: #c9d4ff;
    box-shadow: 0.01em 0 0 #c9d4ff, -0.01em 0 0 #c9d4ff;
    padding: 3px;
    line-height: 1.7;

    text-decoration: none;
    color: #222;

    &:hover {
        background-color: #acbaef;
        box-shadow: 0.01em 0 0 #acbaef, -0.01em 0 0 #acbaef;
    }
`;

const Result = ({ resultId }) => {
    const [song, setSong] = useState(null);
    const [lyricsData, setLyricsData] = useState(null);

    const scrapePage = path => {
        axios.get(`${BASE_URL}scrape?path=${path}`).then(({ data }) => {
            setLyricsData(data);
        });
    };

    useEffect(() => {
        axios.get(`${BASE_URL}proxy/songs/${resultId}`).then(result => {
            const song = result.data.response.song;
            setSong(song);
            scrapePage(song.path);
        });
    }, [resultId]);

    return (
        <div>
            <div>id: {resultId}</div>
            {song ? (
                <div>
                    <div>{song.primary_artist.name}</div>
                </div>
            ) : null}
            {lyricsData ? (
                <div>
                    {lyricsData.map(({ text, referentId }) => {
                        if (referentId) {
                            return (
                                <>
                                    <Referent
                                        href={`/referent/${referentId}`}
                                        data-referent-id={referentId}
                                        dangerouslySetInnerHTML={{
                                            __html: text.replace(
                                                /(?:\r\n|\r|\n)/g,
                                                "<br />"
                                            )
                                        }}
                                    />
                                    <br />
                                </>
                            );
                        }
                        return <p>{text}</p>;
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default Result;
