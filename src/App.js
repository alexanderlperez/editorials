import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Dashboard from './Containers/Dashboard.js';
import Article from './Pages/Article.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// placeholder, in the case that multi-user login is added this will be controlled by actual account service
const curEditorId = 0; 

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/public/:id" component={Article} />
                    <Dashboard authorId={curEditorId} />
                </div>
            </Router>
        );
    }
}

export default App;
