//Import necessary modules and database connection
import { db } from "../db.js"
import jwt from "jsonwebtoken"
import moment from "moment";

// Define function to retrieve comments for a post
export const getComments = (req, res) => {

    // Construct SQL query to select comments and associated user info for a given post ID
    const q = `SELECT c.*, u.id as userId, username, img FROM comments as c JOIN users AS u ON (u.id = c.uid)
    WHERE c.pid = ? ORDER BY c.createdAt DESC `

    // Execute query with post ID from request query parameters
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}

// Define function to add a new comment to a post
export const addComment = (req, res) => {
    // Check if user is authenticated by verifying JWT token stored in cookie
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        // Construct SQL query to insert new comment into database
        const q = "INSERT INTO comments (`desc`,`createdAt`,`uid`,`pid`) VALUES (?)"

        // Define values to be inserted into query, including comment description, current timestamp, user ID from token, and post ID from request body
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ]

        // Execute query with values and handle any errors, returning success message in response
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Comment has been created !")
        })
    })
}