import { db } from "../db.js"
import jwt from "jsonwebtoken"


export const getUser = (req, res) => {

  const q = "SELECT `id`,`username`, `email`, `img` FROM users WHERE id = ?"

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).send(err)
    return res.status(200).json(data)
  })



}


export const updateUser = (req, res) => {

  const userId = req.params.id;
  const { username, email, img } = req.body;

  const token = req.cookies.access_token
  if (!token) return res.status(401).json("Not authenticated!")

  jwt.verify(token, "secretekey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [email, username], (err, data) => {
      if (err) return res.json(err)
      if (data.length > 0) return res.status(409).json("User already exists!")

      console.log(username,email)

      // Query the database to update the user with the given ID
      db.query('UPDATE users SET username = ?, email = ?, img = ? WHERE id = ?', [username, email, img, userId, userInfo.id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating user');
        } else {
          console.log(result)
          res.status(200).send('User updated successfully');
        }
      });
    })
  })
}

export const deleteUser = (req, res) => {
  const token = req.cookies.access_token

  if (!token) return res.status(401).json("Not authenticated!")

  jwt.verify(token, "secretekey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    const q = "DELETE FROM users WHERE `id` = ?"
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err)
      return res.json("User has been deleted!")

    })
  })

}