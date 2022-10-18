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
    db.getAllImages().then((result) => res.json(result));
});

app.get("/images/more", (req, res) => {
    const lastId = req.query.lastId;
    db.getMoreImages(lastId).then(([images, { id }]) => {
        const responseObj = { images, id };
        res.json(responseObj);
    });
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

app.get("/comments/:id", (req, res) => {
    const id = req.params.id;
    db.getCommentsByImageId(id).then((result) => res.json(result));
});

app.post("/comments/:id", (req, res) => {
    const imageId = req.params.id;
    const { username, comment } = req.body;
    db.insertComment(username, comment, imageId).then((result) =>
        res.json(result)
    );
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
