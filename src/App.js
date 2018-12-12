import React, { Component } from "react";
import { Router, Link } from "@reach/router";
import axios from "axios";
import Wrapper from "./components/Wrapper";
import ResultsScrollView from "./components/ResultsScrollView";
import ResultsItem from "./components/ResultsItem";

import Home from "pages/Home";
import Result from "pages/Result";

const BASE_URL = "/.netlify/functions/proxy/";

class App extends Component {
    state = {
        searchTerm: "",
        searchDisabled: false
    };

    handleChange = event => {
        this.setState({ searchTerm: event.target.value });
    };

    handleSubmit = event => {
        this.setState({ searchDisabled: true });
        event.preventDefault();

        axios
            .get(`${BASE_URL}search?q=${this.state.searchTerm}`)
            .then(function(response) {
                // handle success
                console.log(response);
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .then(function() {
                // always executed
            });
    };

    render() {
        return (
            <Wrapper>
                <form
                    onSubmit={this.handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "320"
                    }}
                >
                    <input
                        type="text"
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                        disabled={this.state.searchDisabled}
                        style={{
                            borderStyle: "solid",
                            borderWidth: "1px",
                            fontSize: "2rem",
                            backgroundColor: this.state.searchDisabled
                                ? "grey"
                                : "white"
                        }}
                    />
                </form>
                <ResultsScrollView>
                    {songData.map(item => (
                        <ResultsItem {...item} />
                    ))}
                </ResultsScrollView>

                <Router>
                    <Home path="/" />
                    <Result path="/results" />
                </Router>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/result">Result</Link>
                </div>

            </Wrapper>
        );
    }
}

const songData = [
    {
        name: "The Song",
        artist: "The Artist"
    },
    {
        name: "The Other Song",
        artist: "The Other Artist"
    }
];

export default App;
