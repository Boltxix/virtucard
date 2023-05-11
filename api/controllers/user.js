//Import the database connection and JWT library
import { db } from "../db.js"
import jwt from "jsonwebtoken"

//Define a function to retrive user data from the database
export const getUser = (req, res) => {

  // Define the SQL query to retrieve user data based on the user ID provided in the request parameters
  const q = "SELECT `id`,`username`, `email`, `img` FROM users WHERE id = ?"

  // Execute the SQL query and send a JSON response with the user data or an error message if there was an error
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).send(err)
    return res.status(200).json(data)
  })
}

// Define a function to update user data in the database
export const updateUser = (req, res) => {

  // Extract the user ID, username, email, and image data from the request body
  const userId = req.params.id;
  const { username, email, img } = req.body;

  // Extract the authentication token from the request cookies
  const token = req.cookies.access_token

  // If there is no authentication token, send a response with an error message
  if (!token) return res.status(401).json("Not authenticated!")

  // Verify the authentication token using the secret key
  jwt.verify(token, "secretekey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    // Define a SQL query to check if the new email or username already exists in the database
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    // Execute the SQL query to check if the new email or username already exists in the database
    db.query(q, [email, username], (err, data) => {
      if (err) return res.json(err)
      if (data.length > 0) return res.status(409).json("User already exists!")


      // If the new email and username do not already exist in the database, update the user data in the database
      db.query('UPDATE users SET username = ?, email = ?, img = ? WHERE id = ?', [username, email, img, userId, userInfo.id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating user');
        } else {
          res.status(200).send('User updated successfully');
        }
      });
    })
  })
}

// Define a function to delete user data from the database
export const deleteUser = (req, res) => {

  // Extract the authentication token from the request cookies
  const token = req.cookies.access_token

  // If there is no authentication token, send a response with an error message
  if (!token) return res.status(401).json("Not authenticated!")

  // Verify the authentication token using the secret key
  jwt.verify(token, "secretekey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    // Define a SQL query to delete the user data from the database based on the user ID provided in the request parameters
    const q = "DELETE FROM users WHERE `id` = ?"

    // Execute the SQL query to delete the user data from the database and send a response with a success message or an error message if there was an error
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err)
      return res.json("User has been deleted!")

    })
  })

}