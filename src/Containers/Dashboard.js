import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'

import Home from '../Pages/Home.js';
import Users from '../Pages/Users.js';
import Articles from '../Pages/Articles.js';
import Article from '../Pages/Article.js';
import Edit from '../Pages/Edit.js';

function Dashboard({location, authorId}) {
    return (
        <div className="Dashboard container-fluid">
            <div className="row">
                <div className="Nav col-3">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/users">Users</Link></li>
                        <li><Link to="/articles">Articles</Link></li>
                    </ul>
                </div>
                
                <div className="Pages col-9">
                    <Switch>
                        <Route exact path="/" component={props => <Home {...props} authorId={authorId} />} />
                        <Route path="/users" component={Users} />
                        <Route path="/articles" component={props => <Articles {...props} authorId={authorId} />} />
                        <Route path="/article/edit/:id" component={props => <Edit {...props} authorId={authorId} />} />
                        <Route path="/article/view/:id" component={Article} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
