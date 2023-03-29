const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const md5 = require("js-md5");
const uuid = require("uuid");

const app = express();
app.use(bodyParser.json());

app.use(cors());

const port = 3001;

const db = new sqlite3.Database(`D:\\gytis.sqlite`);

function initializeDbTables() {
    db.serialize(() => {
        // Create required storage tables
        db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, session TEXT, UNIQUE(username, password))");
        db.run("CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, description TEXT, foto TEXT, answer TEXT, likes INTEGER DEFAULT 0)");

        // Add "registered" users
        const stmt = db.prepare("INSERT OR IGNORE INTO users VALUES (?, ?, ?)");
        stmt.run("admin", md5("admin"), null);
        stmt.run("gytis", md5("admin"), null);
        stmt.finalize();
    });

    // db.close();
}

async function checkSession(session) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all("SELECT * FROM users WHERE session = (?)", [session], (err, rows) => {  
                if (err) {
                    console.log("Check session failed", err.message);
                    resolve(false);
                    return;
                }

                if (rows && rows.length > 0)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    });
}

async function addSession(username, password, session) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("UPDATE users SET session = (?) WHERE username = (?) AND password = (?)",
                [session, username, md5(password)], function (err) {
                    console.log("addSession result", err, this);

                    if (err) {
                        console.log("Adding session failed", err.message);
                        resolve(false);
                        return;
                    }

                    const numChanges = this.changes;
                    if (numChanges > 0) {
                        console.log(`A row has been updated (${username} ${password}) with session ${session}`);
                        resolve(true);
                    } else {
                        console.log(`No rows were updated with session ${session}.`);
                        resolve(false);
                    }
                });
        });
    });
}

function insertQuestion(name, category, description, foto, answer) {
    db.serialize(() => {
        db.run("INSERT INTO questions (name, category, description, foto, answer) VALUES (?, ?, ?, ?, ?)",
            [name, category, description, foto, answer], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                console.log(`A row has been inserted with (${name} ${category})`);
            });
    });
}

function deleteQuestion(id) {
    db.serialize(() => {
        db.run("DELETE FROM questions WHERE id = (?)", [id], 
            (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                console.log(`A row has been deleted with id ${id}`);
            });
    });
}

async function getAllQuestions() {
    return new Promise((resolve, reject) => {
        const users = [];

        db.serialize(() => {
            db.all("SELECT * FROM questions", [], (err, rows) => {  
                if (err) {
                    console.log(err.message);
                    resolve([]);
                }
        
                rows.forEach(row => users.push(row));
                resolve(users);
            });
        });
    });
}

async function getQuestion(id) {
    return new Promise((resolve, reject) => {
        const users = [];

        db.serialize(() => {
            db.all("SELECT * FROM questions WHERE id = (?)", [id], (err, rows) => {  
                if (err) {
                    console.log(err.message);
                    resolve([]);
                }
        
                rows.forEach(row => users.push(row));
                resolve(users[0]);
            });
        });
    });
}

function addLike(id) {
    db.serialize(() => {
        db.run("UPDATE questions SET likes = likes + 1 WHERE id = (?)", [id], 
        (err) => {
            if (err) {
                console.log(err.message);
                return;
            }

            console.log(`A like has been added to id ${id}`);
        });
    });
}

function removeLike(id) {
    db.serialize(() => {
        db.run("UPDATE questions SET likes = likes - 1 WHERE id = (?)", [id], 
        (err) => {
            if (err) {
                console.log(err.message);
                return;
            }

            console.log(`A like has been removed from id ${id}`);
        });
    });
}

function addAnswer(id, answer) {
    db.serialize(() => {
        db.run("UPDATE questions SET answer = (? )WHERE id = (?)", [answer, id], 
        (err) => {
            if (err) {
                console.log(err.message);
                return;
            }

            console.log(`An answer has been added to id ${id}`);
        });
    });
}

app.get("/login-check", async (req, resp) => {
    const session = req.headers["authorization"];
    console.log(`Got session: ${session}`);
    
    if (!session) {
        resp.sendStatus(401);
        console.log("Session is empty.")
        return;
    }

    const isLoggedIn = await checkSession(session);
    if (isLoggedIn)
        resp.sendStatus(200);
    else 
        resp.sendStatus(401);
});

app.post("/login", async (req, resp) => {
    console.log("Got login", req.body);

    const username = req.body.username;
    const password = req.body.password;
    const session = uuid.v4();
    const successfulLogin = await addSession(username, password, session);
    console.log("successful login", successfulLogin);
    if (successfulLogin)
        resp.status(200).send(session);
    else
        resp.sendStatus(404);
});

app.route("/questions/")
    .get(async (req, resp) => {
        resp.send(await getAllQuestions());
    })
    .post((req, resp) => {
        const obj = req.body;

        if (obj.name && obj.category && obj.description) {
            insertQuestion(obj.name, obj.category, obj.description);         
            resp.sendStatus(201);
            return;
        }

        resp.status(400).send("Missing or wrong parameters");
    });

app.route("/questions/:id")
    .get(async (req, resp) => {
        const id = req.params.id;
        resp.send(await getQuestion(id));
    })
    .delete((req, resp) => {
        const id = req.params.id;
        deleteQuestion(id);

        resp.sendStatus(200);
    });

app.route("/questions/:id/like")
    .post((req, resp) => {
        const id = req.params.id;
        addLike(id);

        resp.sendStatus(200);
    });

app.route("/questions/:id/dislike")
    .post((req, resp) => {
        const id = req.params.id;
        removeLike(id);

        resp.sendStatus(200);
    });

app.route("/questions/:id/answer")
    .post((req, resp) => {
        const id = req.params.id;
        const answer = req.body.answer;
        addAnswer(id, answer);

        resp.sendStatus(200);
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    initializeDbTables();
});