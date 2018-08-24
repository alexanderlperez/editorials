const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const users = require('./dummy-users.json');
const port = 3001;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/user', function (req, res, next) {
    res.json(users)
    res.end();
    next();
})

app.listen(port, function () {
    console.log('listening on port', port);
})
