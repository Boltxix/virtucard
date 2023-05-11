//Import the database connection and JWT library
import { db } from "../db.js"
import jwt from "jsonwebtoken"

// Function to get all events for the authenticated user
export const getEvents = (req, res) => {
    // Get the access token from the cookie
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the token using the secret key
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        // SQL query to get all events for the authenticated user
        const q = "SELECT * FROM events WHERE uid = ? ORDER BY date DESC"

        // Execute the query with the user ID as a parameter
        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).send(err)

            return res.status(200).json(data)
        })

    })
}

// Function to get a single event by ID
export const getEvent = (req, res) => {
    // SQL query to get a single event by ID
    const q = "SELECT `id`, `name`, `img`, `date`, `location`, `description` FROM events WHERE id = ?"

    // Execute the query with the event ID as a parameter
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).send(err)
        return res.status(200).json(data[0])
    })
}

// Function to add a new event
export const addEvent = (req, res) => {
    // Get the access token from the cookie
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the token using the secret key
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        // SQL query to insert a new event
        const q = "INSERT INTO events (`name`,`img`,`date`,`location`,`description`,`uid`) VALUES (?)"

        // Array of values to insert into the query
        const values = [
            req.body.name,
            req.body.img,
            req.body.date,
            req.body.location,
            req.body.description,
            userInfo.id // Use the authenticated user's ID as the UID for the new event
        ]

        // Execute the query with the values array as a parameter
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            return res.json("Event has been created !")
        })
    })
}

// Function to delete an event by ID
export const deleteEvent = (req, res) => {
    // Get the access token from the cookie
    const token = req.cookies.access_token

    if (!token) return res.status(401).json("Not authenticated!")

    // Verify the token using the secret key
    jwt.verify(token, "secretekey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        // SQL query to delete an event by ID
        const q = "DELETE FROM events WHERE `id` = ?"

        // Execute the query with the event ID and user ID as parameters
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).send(err)
            return res.json("Event has been deleted!")

        })
    })

}