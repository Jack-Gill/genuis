import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import ResultsScrollView from './components/ResultsScrollView';
import axios from 'axios';
import ResultsItem from './components/ResultsItem';

const BASE_URL = '/.netlify/functions/proxy/';

class App extends Component {
    constructor(props) {
        super(props);

        this.getResultsDebounced = debounce(this.getResults, 100);

        this.state = {
            searchTerm: '',
            searching: false,
            searchDisabled: false,
            searchResults: [],
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
                    this.handleSearchResultData(response);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
    };

    handleSearchResultData = (searchData) => {
        const hits = (searchData.data && searchData.data.response) ? searchData.data.response.hits : [];

        const newResults = hits.map((item) => {
            const { result } = item;
            return {
                name: result.title,
                artist: result.primary_artist ? result.primary_artist.name : 'unknown',
                thumbnailURL: result.header_image_thumbnail_url,
                hot: result.stats ? result.stats.hot : false,
            };
        });

        this.setState({
            searching: false,
            searchResults: newResults,
        });
    };

    render() {
        const {
            searching,
            searchTerm,
            searchResults
        } = this.state;
        console.log(searchResults.length);
        return (
            <Wrapper>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <form
                        onSubmit={this.handleSubmit}
                        style={{
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
                    {searchResults.length > 0 && searchTerm.length > 0 &&
                        <ResultsScrollView>
                            {searchResults.map((item) => (
                                <ResultsItem  key={`results-item-${item.name}-${item.artist}`} {...item} />
                            ))}
                        </ResultsScrollView>}
                </div>
            </Wrapper>
        );
    }
}

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
