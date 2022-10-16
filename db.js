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
