require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();
const { PORT = 8080 } = process.env;
const { uploader } = require("./middleware");
const fs = require("fs");
const s3 = require("./s3");
const db = require("./db");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/images", (req, res) => {
    const images = db.getAllImages().then((result) => res.json(result));
});

app.get("/image/:id", (req, res) => {
    const id = req.params.id;
    db.getImageById(id).then((result) => res.json(result));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    const { username, title, description } = req.body;

    db.insertImage(url, username, title, description)
        .then((image) => res.json(image).statusCode(201))
        .catch((err) => {
            // TODO: handle the error here
            res.json({ message: err.message });
        });
});

app.get("/image/:id", (req, res) => {
    // get id from the request
    // get image data from database, finding by id
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
