//Import the database connection and JWT library
import { db } from "../db.js"
import jwt from "jsonwebtoken"

//Define a function to get the userID's of all users who have like a post
export const getLikes = (req, res) => {
    const q = "SELECT uid FROM likes WHERE pid = ? "
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err)

        return res.json(data.map(like => like.uid))
    })
}

// Define a function to add a like to a post for the authenticated user
export const addLike = (req, res) => {
    // Get the access token from the request cookie
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the token with the secret key
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO likes (`uid`,`pid`) VALUES (?)"

        const values = [
            userInfo.id, // The user ID from the token
            req.body.postId // The post ID from the request body
        ]

        // Execute the query with the values as parameters
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been liked")
        })
    })
}

// Define a function to remove a like from a post for the authenticated user
export const deleteLike = (req, res) => {
    // Get the access token from the request cookie
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the token with the secret key
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "DELETE FROM likes WHERE `uid` = ? AND `pid`= ?"

        // Execute the query with the user ID from the token and the post ID from the request query as parameters
        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been unliked")
        })
    })
}