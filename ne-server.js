const async = require('async');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const CONFIG = require('./config.json');
const port = CONFIG.port;
const DB_FILE = CONFIG.dbFile;

const app = express();
app.use(cors({ methods: "GET,POST,PATCH,DELETE,COPY" }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        throw new Exception('Could not connect to database: ' + DB_FILE)
    }
});

app.get('/api/users', function (req, res, next) {
    db.all('select * from Users', function (err, users) {
        if (err) {
            console.error('Error:', err);
            res.status(500).end();
        }

        res.json(users)
        res.end();
    })
})

app.get('/api/articles', function (req, res, next) {
    db.all('select * from Articles', function (err, rows) {
        if (err) {
            console.error('There was a problem w/ DB:', err);
            res.status(500).end();
        }

        res.json(rows)
        res.end();
    })
})

app.get('/api/articles/:id', function (req, res, next) {
    const id = parseInt(req.params.id);

    db.get('select * from Articles where id = ?', id, function (err, rows) {
        if (err) {
            console.error('Error accessing data:', err);
            res.status(500).end();
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
            res.status(500).end();
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
            res.status(500).end();
        }

        res.end();
    });
})

app.delete('/api/articles/:id', function (req, res, next) {
    const id = req.params.id;

    db.run('delete from Articles where id=?', id, function (err) {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).end();
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
            res.status(500).end();
        }

        const { title, body } = rows;

        db.run('insert into Articles (created, authorId, title, body) values(?,?,?,?)', date, authorId, title, body, function (err) {
            if (err) {
                console.error('Error saving data:', err);
                res.status(500).end();
            }

            res.json({ id: this.lastID });
            res.end();
        });
    })
})

app.post('/api/shares', function (req, res, next) {
    const { authorId, userId, articleId } = req.body;
    const created = new Date().toISOString();

    // 1. retrieve relevant data from DB
    // 2. send an email to the user with the article
    // 3. create a Share record in the database

    async.series([
        function (cb) {
            db.get('select * from Articles where id = ?', articleId, function (err, article) {
                if (err) {
                    cb(err);
                }

                cb(null, article);
            })
        },
        function (cb) {
            db.get('select * from Users where id = ?', authorId, function (err, author) {
                if (err) {
                    cb(err);
                }

                cb(null, author);
            })
        },
        function (cb) {
            db.get('select * from Users where id = ?', userId, function (err, user) {
                if (err) {
                    cb(err);
                }

                cb(null, user);
            })
        },
    ], function (err, data) {
        if (err) {
            console.error('Error:', err);
            res.status(500).end();
        }

        const [article, author, user] = data;

        const transport = nodemailer.createTransport({
            secure: true,
            host: CONFIG.smtp.host,
            port: CONFIG.smtp.port,
            auth: {
                user: CONFIG.smtp.username,
                pass: CONFIG.smtp.password
            }
        })


        const mailOptions = {
            from: author.email,
            to: user.email,
            subject: "We think you'll find this useful...",
            html: 
            `
            <h1>${article.title}</h1>
            <p>${article.body}</p>
            <img src="">
            `
            // TODO: pixel
        }

        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error('Error:', err);
                res.status(500).end();
            }

            db.run('insert into Shares (created, userId, authorId, articleId) values (?,?,?,?)', created, userId, authorId, articleId, function (err) {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).end();
                }

                res.json({ id: this.lastID });
                res.end();
            });
        })
    })
})

app.listen(port, function () {
    console.log('listening on port', port);
})
