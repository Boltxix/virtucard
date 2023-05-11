//Import necessary modules
import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Define the register function
export const register = (req, res) => {

    // Check if user already exists in the database
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length > 0) return res.status(409).json("User already exists!")

        // Hash the password and insert the user's information into the database
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err)
            return res.status(200).json("User has been created.")
        })

    })

}
// Define the login function
export const login = (req, res) => {

    // Check if user exists in the database
    const q = "SELECT * FROM users WHERE username = ?"


    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User Not Found")

        // Check if password matches the hashed password in the database
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

        if (!isPasswordCorrect) return res.status(400).json("Wrong username or password")

        // Generate a JWT and set it as an HTTP-only cookie in the response
        const token = jwt.sign({ id: data[0].id }, "secretekey");
        const { password, ...other } = data[0]

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)
    })

}

// Define the logout function
export const logout = (req, res) => {

    // Clear the JWT cookie from the client's browser
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out")

}