import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import ResultsScrollView from './components/ResultsScrollView';
import axios from 'axios';
import ResultsItem from './components/ResultsItem';

const BASE_URL = '/.netlify/functions/proxy/'

class App extends Component {
    state = {
        searchTerm: '',
        searchDisabled: false,
    };

    handleChange = (event) => {
        this.setState({searchTerm: event.target.value});
    };

    handleSubmit = (event) => {
        this.setState({searchDisabled: true});
        event.preventDefault();

        axios.get(`${BASE_URL}search?q=${this.state.searchTerm}`)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    render() {
        return (
            <Wrapper>
                <form
                    onSubmit={this.handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '320',
                    }}
                >
                    <input
                        type="text"
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                        disabled={this.state.searchDisabled}
                        style={{
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            fontSize: '2rem',
                            backgroundColor: this.state.searchDisabled ? 'grey' : 'white',
                        }}
                    />
                </form>
                <ResultsScrollView>
                    {songData.map((item) => (
                        <ResultsItem {...item} />
                    ))}
                </ResultsScrollView>
            </Wrapper>
        );
    }
}

const songData = [
    {
        name: 'The Song',
        artist: 'The Artist',
    },
    {
        name: 'The Other Song',
        artist: 'The Other Artist',
    },
];

export default App;
