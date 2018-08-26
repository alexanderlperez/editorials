const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const users = require('./dummy-users.json');

const port = 3001;
const DB_FILE = './ne-editorials.db';

const app = express();
app.use(cors({ methods: "GET,POST,PATCH,DELETE,COPY" }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        throw new Exception('Could not connect to database: ' + DB_FILE)
    }

    console.log('Connected to the database.');
});

app.get('/api/users', function (req, res, next) {
    res.json(users)
    res.end();
})

app.get('/api/articles', function (req, res, next) {
    db.all('select * from Articles', function (err, rows) {
        if (err) {
            console.error('There was a problem w/ DB:', err);
            next();
        }

        console.log('showing articles', rows);
        res.json(rows)
        res.end();
    })
})

app.get('/api/articles/:id', function (req, res, next) {
    const id = parseInt(req.params.id);

    db.get('select * from Articles where id = ?', id, function (err, rows) {
        if (err) {
            console.error('Error accessing data:', err);
            next();
        }

        res.json(rows)
        res.end();
    })
})

app.post('/api/articles', function (req, res, next) {
    const { authorId, title, body } = req.body;
    const date = new Date().toISOString();

    db.run('insert into Articles (created, authorId, title, body) values(?,?,?,?)', date, authorId, title, body, function (err) {
        if (err) {
            console.error('Error saving data:', err);
            next();
        }

        res.json({ id: this.lastID });
        res.end();
    });
})

app.patch('/api/articles/:id', function (req, res, next) {
    const { title, body } = req.body;
    const id = req.params.id;
    const date = new Date().toISOString();

    db.run('update Articles set updated=?, title=?, body=? where id=?', date, title, body, id, function (err) {
        if (err) {
            console.error('Error updating data:', err);
            next();
        }

        res.end();
    });
})

app.delete('/api/articles/:id', function (req, res, next) {
    const id = req.params.id;

    console.log('deleting article', id);

    db.run('delete from Articles where id=?', id, function (err) {
        if (err) {
            console.error('Error deleting data:', err);
            next();
        }

        res.end();
    });
})

app.copy('/api/articles/:id', function (req, res, next) {
    const id = req.params.id
    const authorId = req.body.authorId;
    const date = new Date().toISOString();

    db.get('select * from Articles where id = ?', id, function (err, rows) {
        if (err) {
            console.error('Error accessing data:', err);
            next();
        }

        const { title, body } = rows;

        db.run(`insert into Articles (created, authorId, title, body) values(?,?,?,?)`, date, authorId, title, body, function (err) {
            if (err) {
                console.error('Error saving data:', err);
                next();
            }

            res.json({ id: this.lastID });
            res.end();
        });
    })
})

app.listen(port, function () {
    console.log('listening on port', port);
})
