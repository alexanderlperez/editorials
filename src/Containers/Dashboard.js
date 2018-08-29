import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'

import Home from '../Pages/Home.js';
import Users from '../Pages/Users.js';
import Articles from '../Pages/Articles.js';
import Article from '../Pages/Article.js';
import Edit from '../Pages/Edit.js';

import CONFIG from '../config.json';

function Dashboard({location, authorId}) {
    return (
        <div className="Dashboard container-fluid">
            <div className="row">
                <div className="Nav col-3">
                    <ul>
                        <li><Link to={CONFIG.prefix + "/"}>Home</Link></li>
                        <li><Link to={CONFIG.prefix + "/users"}>Users</Link></li>
                        <li><Link to={CONFIG.prefix + "/articles"}>Articles</Link></li>
                    </ul>
                </div>
                
                <div className="Pages col-9">
                    <Switch>
                        <Route exact path={CONFIG.prefix + "/"} component={props => <Home {...props} authorId={authorId} />} />
                        <Route path={CONFIG.prefix + "/users"} component={Users} />
                        <Route path={CONFIG.prefix + "/articles"} component={props => <Articles {...props} authorId={authorId} />} />
                        <Route path={CONFIG.prefix + "/article/edit/:id"} component={props => <Edit {...props} authorId={authorId} />} />
                        <Route path={CONFIG.prefix + "/article/view/:id"} component={Article} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
