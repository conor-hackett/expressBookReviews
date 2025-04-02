const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User not valid!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const listBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        })
    });
    
    listBooks.then((books) => {
                res.send(JSON.stringify(books, null, 4));
            });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const getBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[isbn]);
        })
    });
    
    getBook.then((book) => {
        res.send(book);
    });
 });


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    const listBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Object.values(books).filter((book) => {
                return book.author === author;
            }));
        })
    });
    
    listBooks.then((books) => {
        res.send(JSON.stringify(books, null, 4));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const listBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Object.values(books).filter((book) => {
                return book.title === title;
            }));
        })
    });
    
    listBooks.then((books) => {
        res.send(JSON.stringify(books, null, 4));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
