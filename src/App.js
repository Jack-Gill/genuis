import React, { Component } from "react";
import { Router, Link } from "@reach/router";
import Wrapper from "components/Wrapper";

import Home from "pages/Home";
import Result from "pages/Result";

class App extends Component {
    render() {
        return (
            <Wrapper>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/result/167180">
                        Blood on the Leaves (result/167180)
                    </Link>
                </div>
                <Router>
                    <Home path="/" />
                    <Result path="/result/:resultId" />
                </Router>
            </Wrapper>
        );
    }
}

export default App;
