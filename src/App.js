import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './Pages/Home.js';
import Users from './Pages/Users.js';
import Articles from './Pages/Articles.js';
import Article from './Pages/Article.js';
import Edit from './Pages/Edit.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="nav col-3">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/users">Users</Link></li>
                                    <li><Link to="/articles">Articles</Link></li>
                                </ul>
                            </div>

                            <div className="pages col-9">
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route path="/users" component={Users} />
                                    <Route exact path="/articles" component={Articles} />
                                    <Route path="/article/edit/:id" component={Edit} />
                                    <Route path="/article/:id" component={Article} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
