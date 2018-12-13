import React, { Component } from "react";
import axios from "axios";
// components
import ResultsScrollView from "components/ResultsScrollView";
import Wrapper from "components/Wrapper";

import { BASE_URL } from 'constants.js';

class Home extends Component {
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
            .get(`${BASE_URL}/proxy/search?q=${this.state.searchTerm}`)
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
                <ResultsScrollView />
            </Wrapper>
        );
    }
}

export default Home;
