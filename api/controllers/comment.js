import { db } from "../db.js"
import jwt from "jsonwebtoken"
import moment from "moment";

export const getComments = (req, res) => {
    const q = `SELECT c.*, u.id as userId, username, img FROM comments as c JOIN users AS u ON (u.id = c.uid)
    WHERE c.pid = ? ORDER BY c.createdAt DESC `

    db.query (q,[req.query.postId], (err,data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}

export const addComment = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO comments (`desc`,`createdAt`,`uid`,`pid`) VALUES (?)"

        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Comment has been created !")
        })
    })
}