import { db } from "../db.js"
import jwt from "jsonwebtoken"

export const getLikes = (req, res) => {
    const q = "SELECT uid FROM likes WHERE pid = ? "
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err)

        return res.json(data.map(like=>like.uid))
    })
}

export const addLike = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO likes (`uid`,`pid`) VALUES (?)"

        const values = [
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been liked")
        })
    })
}

export const deleteLike = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "DELETE FROM likes WHERE `uid` = ? AND `pid`= ?"

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Post has been unliked")
        })
    })
}