// loads all variables that are found in the .env file,
// and adds them to process.env! Now you can use them in your script below.
require("dotenv").config();

const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;

// create a db object. it can talk to the database: use db.query(...)
const db = spicedPg(DATABASE_URL);

module.exports.insertImage = function (url, username, title, description) {
    const sql = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`;
    return db
        .query(sql, [url, username, title, description])
        .then((result) => result.rows[0])
        .catch((error) => {
            console.log("error inserting image", error);
        });
};

module.exports.getAllImages = function () {
    const sql = `SELECT * FROM images;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => {
            console.log("error getting all images", error);
        });
};

module.exports.getImageById = function (id) {
    const sql = `SELECT * FROM images WHERE id=$1;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows[0])
        .catch((error) => {
            console.log("error getting all images", error);
        });
};

module.exports.getCommentsByImageId = function (image_id) {
    const sql = `SELECT * FROM comments WHERE image_id=$1;`;
    return db
        .query(sql, [image_id])
        .then((result) => result.rows)
        .catch((error) => {
            console.log("error getting all comments", error);
        });
};

module.exports.insertComment = function (username, comment, imageId) {
    const sql = `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *;`;
    return db
        .query(sql, [username, comment, imageId])
        .then((result) => result.rows[0])
        .catch((error) => {
            console.log("error inserting image", error);
        });
};
