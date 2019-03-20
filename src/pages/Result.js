import React, { Component } from "react";
import axios from "axios";
import { BASE_URL } from "constants.js";

class Result extends Component {
    state = {
        song: null,
        lyricsHtml: null
    };

    scrapePage = path => {
        axios.get(`${BASE_URL}scrape?path=${path}`).then(({ data }) => {
            this.setState({
                lyricsHtml: data.lyricsHtml
            });
        });
    };

    componentDidMount() {
        const { resultId } = this.props;
        axios.get(`${BASE_URL}proxy/songs/${resultId}`).then(result => {
            console.log(result.data.response.song);
            this.setState({
                song: result.data.response.song
            });
            this.scrapePage(result.data.response.song.path);
        });

    }

    render() {
        const { resultId } = this.props;
        const { song, lyricsHtml } = this.state;

        return (
            <div>
                <div>id: {resultId}</div>
                {song ? (
                    <div>
                        <div>{song.primary_artist.name}</div>
                    </div>
                ) : null}
                {lyricsHtml ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: lyricsHtml
                        }}
                    />
                ) : null}
            </div>
        );
    }
}

export default Result;
