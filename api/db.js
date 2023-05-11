import mysql from "mysql2"
//Creating connection to msql database
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "virtucard"
})