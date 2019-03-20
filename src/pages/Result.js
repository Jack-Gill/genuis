import React, { Component, Fragment } from "react";
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

class Result extends Component {
    state = {
        song: null,
        lyricsData: null
    };

    scrapePage = path => {
        axios.get(`${BASE_URL}scrape?path=${path}`).then(({ data }) => {
            console.log(data);

            this.setState({
                lyricsData: data.lyricsData
            });
            
            console.log(data.lyricsData);

            //axios.get(`${BASE_URL}translate/`).then(({data}) => console.log(data.translation));
        });
    };

    componentDidMount() {
        const { resultId } = this.props;
        axios.get(`${BASE_URL}proxy/songs/${resultId}`).then(result => {
            this.setState({
                song: result.data.response.song
            });
            this.scrapePage(result.data.response.song.path);
        });
    }

    render() {
        const { resultId } = this.props;
        const { song, lyricsData } = this.state;

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
                                    <Fragment>
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
                                    </Fragment>
                                );
                            }
                            return <p>{text}</p>;
                        })}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Result;
