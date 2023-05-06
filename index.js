const express = require('express');
const axios = require('axios');
const https = require('https');
const file = require("fs")
const cors = require("cors");
const { users } = require('./users');

const bodyParser = require('body-parser');

const app = express();

app.use(cors());

app.use(express.json());

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

app.get('/payment/:id', (req, res) => {
    const invoiceId = req.params['id'];

    doApiCall(invoiceId)
        .then(response => {
            //res.status(200).json(response.data);
            res.status(400).json({ ...response.data, message: 'hello World' });
        })
        .catch(error => {
            console.log("error", error);
            res.status(500).json({ error: "Something bad happened" })
        });
});

app.get("/file/:id", (req, res) => {

    file.readFile('response.json', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        return res.end();
    });
});

app.get("/hello", (req, res) => {
    file.readFile('hello.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
});

app.get("/sayhello/:id", (req, res) => {

    const pathId = req.params['id'];
    const name = req.query["name"];
    const headerValue = req.headers["content-type"];

    res.send("Hello World : " + req.params['id'] + " " + name + " " + headerValue);
});

app.post("/login", (req, res) => {
    const username = req.body.username;

    if (!username) {
        res.status(400).json({
            message: "username is require"
        });
        return;
    }

    const password = req.body.password;
    if (!password) {
        res.status(400).json({
            message: "password is required"
        });
        return;
    }

    const user = users.find(user => user.password == password && user.username == username);

    if (!user) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }

    res.json({
        username,
        token: "xyz"



    });
})

app.listen(8002, () => {
    console.log("started");
})



