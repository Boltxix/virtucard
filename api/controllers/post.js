//Import the database connection and JWT library
import { db } from "../db.js"
import jwt from "jsonwebtoken"

//Retrive all posts from the database
export const getPosts = (req, res) => {
    const q = req.query.cat
        ? "SELECT * FROM posts WHERE cat=? ORDER BY date DESC "
        : "SELECT * FROM posts ORDER BY date DESC"

    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

//Retrive a single post from the database
export const getPost = (req, res) => {
    const q = "SELECT p.id, `username`,`title`,`desc`,p.img,u.img AS userImg,`cat`,`date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)

        return res.status(200).json(data[0])
    })
}

//Add a new post to the database
export const addPost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    //Verify the user's aithentication token
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO posts (`title`,`desc`,`img`,`cat`,`date`,`uid`) VALUES (?)"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]

        //Insert the post data into the database
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been created !")
        })
    })
}

//Delete a post from the database
export const deletePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the user's authentication token
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?"

        // Delete the post from the database if the user is the owner
        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err) return res.status(403).json("You can delete only your post!")

            return res.json("Post has been deleted!")
        })
    })
}

// Update an existing post in the database
export const updatePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the user's authentication token
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const q = "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]

        // Update the post in the database if the user is the owner
        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been updated !")
        })
    })
}

