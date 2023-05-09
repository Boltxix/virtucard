import { db } from "../db.js"
import jwt from "jsonwebtoken"

export const getEvents = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "SELECT * FROM events WHERE uid = ? ORDER BY date DESC"
        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).send(err)

            return res.status(200).json(data)
        })

    })
}

export const getEvent = (req, res) => {
    const q = "SELECT `id`, `name`, `img`, `date`, `location`, `description` FROM events WHERE id = ?"

    db.query(q, [req.params.id], (err,data)=>{
        if (err) return res.status(500).send(err)
        return res.status(200).json(data[0])
    })
}

export const addEvent = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO events (`name`,`img`,`date`,`location`,`description`,`uid`) VALUES (?)"

        const values = [
            req.body.name,
            req.body.img,
            req.body.date,
            req.body.location,
            req.body.description,
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Event has been created !")
        })
    })
}

export const deleteEvent = (req, res) => {
    const token = req.cookies.access_token
  
    if (!token) return res.status(401).json("Not authenticated!")
  
    jwt.verify(token, "secretekey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!")
  
      const q = "DELETE FROM events WHERE `id` = ?"
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).send(err)
        return res.json("Event has been deleted!")
  
      })
    })
  
  }