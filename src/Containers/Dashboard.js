import React, { Component } from 'react';
import { withRouter, Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from '../Pages/Home.js';
import Users from '../Pages/Users.js';
import Articles from '../Pages/Articles.js';
import Article from '../Pages/Article.js';
import Edit from '../Pages/Edit.js';

function Dashboard({authorId}) {
    return (
        <div class="Dashboard container-flex">
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
                    <Route path="/articles" component={props => <Articles {...props} authorId={authorId} />} />
                    <Route path="/article/edit/:id" component={props => <Edit {...props} authorId={authorId} />} />
                    <Route path="/article/:id" component={Article} />
                </Switch>
            </div>
        </div>
    )
}

export default withRouter(Dashboard);
