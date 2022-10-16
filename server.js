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

// let images = [
//     {
//         id: 1,
//         url: "https://picsum.photos/984/600?random=1",
//         title: "some random text 1",
//     },
//     {
//         id: 2,
//         url: "https://picsum.photos/984/600?random=2",
//         title: "some random text 2",
//     },
//     {
//         id: 3,
//         url: "https://picsum.photos/984/600?random=3",
//         title: "some random text 3",
//     },
//     {
//         id: 4,
//         url: "https://picsum.photos/984/600?random=4",
//         title: "some random text 4",
//     },
//     {
//         id: 5,
//         url: "https://picsum.photos/984/600?random=5",
//         title: "some random text 5",
//     },
//     {
//         id: 6,
//         url: "https://picsum.photos/984/600?random=6",
//         title: "some random text 6",
//     },
//     {
//         id: 7,
//         url: "https://picsum.photos/984/600?random=7",
//         title: "some random text 7",
//     },
//     {
//         id: 8,
//         url: "https://picsum.photos/984/600?random=8",
//         title: "some random text 8",
//     },
//     {
//         id: 9,
//         url: "https://picsum.photos/984/600?random=9",
//         title: "some random text 9",
//     },
//     {
//         id: 10,
//         url: "https://picsum.photos/984/600?random=10",
//         title: "some random text 10",
//     },
//     {
//         id: 11,
//         url: "https://picsum.photos/984/600?random=11",
//         title: "some random text 11",
//     },
//     {
//         id: 12,
//         url: "https://picsum.photos/984/600?random=12",
//         title: "some random text 12",
//     },
// ];

app.get("/images", (req, res) => {
    const images = db.getAllImages().then((result) => res.json(result));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log(req.body);
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    const { username, title, description } = req.body;

    db.insertImage(url, username, title, description)
        .then((image) => res.json(image).statusCode(201))
        .catch((err) => {
            // TODO: handle the error here
            res.json({ message: err.message });
        });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
