import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import ResultsScrollView from './components/ResultsScrollView';
import axios from 'axios';
import ResultsItem from './components/ResultsItem';

const BASE_URL = '/.netlify/functions/proxy/';

class App extends Component {
    constructor(props) {
        super(props);

        this.getResultsDebounced = debounce(this.getResults, 250, true);

        this.state = {
            searchTerm: '',
            searching: false,
            searchDisabled: false,
        };
    }

    handleChange = (event) => {
        const searchTerm = event.target.value;
        this.setState({
            searchTerm,
            searching: true,
        });
        this.getResultsDebounced(searchTerm)
    };

    handleSubmit = (event) => {
        this.setState({searchDisabled: true});
        event.preventDefault();
        this.getResults(this.state.searchTerm);
    };

    getResults = (searchTerm) => {
        axios.get(`${BASE_URL}search?q=${searchTerm}`)
                .then((response) => {
                    // handle success
                    console.log(response);
                    this.setState({searching: false})
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
        const { searching } = this.state;
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
                    {!searching && songData.map((item) => (
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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export default App;
