import React, { Component } from 'react';
import { withRouter, Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Dashboard from './Containers/Dashboard.js';
import PublicArticle from './Pages/PublicArticle.js';
import Page404 from './Pages/Page404.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// placeholder, in the case that multi-user login is added this will be controlled by actual account service
const curEditorId = 0; 

class App extends Component {
    constructor(props) {
        super(props);

        this.ToggleDashboard = withRouter(({location}) => {
            if (location.pathname.includes('public') || location.pathname.includes('404')) {
                return null;
            }

            return <Dashboard authorId={curEditorId} />
        });
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/404" component={Page404} />
                    <Route path="/public/:id" component={PublicArticle} />
                    <this.ToggleDashboard />
                </div>
            </Router>
        );
    }
}

export default App;
