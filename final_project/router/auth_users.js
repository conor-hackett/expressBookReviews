const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let existingUsers = users.filter((user) => {
        return user.username === username;
    });

    if (existingUsers.length > 0)
    {
        return false;
    }
    return true;
}

const authenticatedUser = (username, password)=>{
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in"});
    }

    if (authenticatedUser(username, password))
    {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    const review = req.query.review;

    const book = books[isbn];

    book.reviews[username] = {
        "review": review
    };

    res.send(`A review of ${book.title} has been added by ${username}`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (isbn) {
        delete books[isbn].reviews[username];
    }

    res.send(`Review of ISBN ${isbn} deleted by ${username}`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
