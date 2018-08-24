const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3001;
const users = require('./dummy-users.json');
const articles = require('./dummy-articles.json');

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/api/user', function (req, res, next) {
    res.json(users)
    res.end();
    next();
})

app.get('/api/article', function (req, res, next) {
    res.json(articles)
    res.end();
    next();
})

app.get('/api/article/:id', function (req, res, next) {
    const id = parseInt(req.params.id) - 1;

    console.log('showing article', req.params.id, articles[id])
    res.json(articles[id])
    res.end();

    next();
})

app.listen(port, function () {
    console.log('listening on port', port);
})
