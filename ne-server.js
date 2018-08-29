const Async = require('async');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4'); 
const fs = require('fs');
const https = require('https');

const CONFIG = require('./config.json');
const PORT = CONFIG.port;
const DB_FILE = CONFIG.dbFile;

const app = express();
app.use(cors({methods: "GET,POST,PATCH,DELETE,COPY"}))
app.use(bodyParser.urlencoded({extended: true})); // support nested, urlencoded objects in requests
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
            return;
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
            return;
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
            return;
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
            return;
        }

        res.json({ id: this.lastID, created: date });
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
            return;
        }

        const date = new Date().toISOString();

        res.send({updated: date})
        res.end();
    });
})

app.delete('/api/articles/:id', function (req, res, next) {
    const id = req.params.id;

    db.run('delete from Articles where id=?', id, function (err) {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).end();
            return;
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
            return;
        }

        const { title, body } = rows;

        db.run('insert into Articles (created, authorId, title, body) values(?,?,?,?)', date, authorId, title, body, function (err) {
            if (err) {
                console.error('Error saving data:', err);
                res.status(500).end();
                return;
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

    Async.series([
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
            return;
        }

        const [article, author, user] = data;
        const uuid = uuidv4();

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
            ${author.first_name} at Noom thinks you'll find this useful:
            <a href="${CONFIG.host}/api/trackers/${uuid}">${article.title}</a>
            `
        }

        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error('Error:', err);
                res.status(500).end();
                return;
            }

            db.run(
                'insert into Shares (created, userId, authorId, articleId, uuid) values (?,?,?,?,?)', 
                created, 
                userId, 
                authorId, 
                articleId, 
                uuid, 
                function (err) {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).end();
                        return;
                    }

                    res.json({ id: this.lastID });
                    res.end();
                }
            );
        })
    })
})

app.get('/api/users/:id/shares', function (req, res, next) {
    //NOTE: this endpoint returns shares essentially from Editors only, since it queries by 
    //the authorId, which is set from and editor id in all frontend actions

    const query = `
        select  
            Shares.uuid,
            Shares.created,
            Shares.accessed,
            Shares.articleId,
            Shares.userId,
            Users.id as userId,
            Users.first_name,
            Users.last_name,
            Articles.title
        from Shares 
        left join Users on Users.id = Shares.userId
        left join Articles on Articles.id = Shares.articleId
        where Shares.authorId=?
        `;

    db.all(query, req.params.id, function (err, shares) {
        if (err) {
            console.error('Error:', err);
            res.status(500).end();
            return;
        }

        res.json(shares)
        res.end();
    })
})

app.get('/api/articles/:id/shares', function (req, res, next) {
    const query = `
        select  
            Shares.uuid,
            Shares.created,
            Shares.accessed,
            Shares.articleId,
            Shares.userId,
            Users.first_name,
            Users.last_name,
            Articles.title
        from Shares 
        left join Users on Users.id = Shares.userId
        left join Articles on Articles.id = Shares.articleId
        where Articles.id=?
        `;

    db.all(query, req.params.id, function (err, shares) {
        if (err) {
            console.error('Error:', err);
            res.status(500).end();
            return;
        }

        res.json(shares)
        res.end();
    })
})

app.get('/api/trackers/:uuid', function (req, res, next) {
    const accessed = new Date().toISOString();
    const uuid = req.params.uuid;

    db.run('update Shares set accessed=? where uuid=?', accessed, uuid);

    const articleQuery = `
        select Articles.id, Shares.articleId from Articles 
        left join Shares on Shares.articleId = Articles.id
        where Shares.uuid=?
        `; 

    db.get(articleQuery, uuid, function (err, article) {
        if (err) {
            console.error('Error:', err);
            res.status(500).end();
            return;
        }

        if (!article) {
            res.redirect(CONFIG.clientUrl + "/404/")
            res.end();
            return;
        }

        res.redirect(CONFIG.clientUrl + "/article/" + article.id)
        res.end();
    })
})


if (CONFIG.https){
    const sslOptions = {
        cert: fs.readFileSync(CONFIG.ssl.certPath),
        key: fs.readFileSync(CONFIG.ssl.keyPath),
    };

    https.createServer(sslOptions, app).listen(PORT, function () {
        console.log('loading https on port', PORT);
    });
} else {
    app.listen(PORT, function () {
        console.log('listening on port', PORT);
    })
}
