import mysql from "mysql2"
//Creating connection to msql database
export const db = mysql.createConnection({
    host: "sql8.freesqldatabase.com",
    user: "sql8618068",
    password: "FjdWAeicX8",
    database: "sql8618068"
})

let lastErrorTime = null;
const errorInterval = 5000;

function handleDatabaseError(error) {
  const currentTime = Date.now();

  if (lastErrorTime === null || currentTime - lastErrorTime > errorInterval) {
    console.error(`Error connecting to database: ${error}`);
    lastErrorTime = currentTime;
  }
}

db.connect((error) => {
  if (error) {
    console.error(`Error connecting to database: ${error}`);
    handleDatabaseError(error);
    return;
  }
  console.log("Connected to database!");
});

db.on("error", (error) => {
  console.error(`Database error: ${error}`);
  handleDatabaseError(error);
});

setInterval(() => {
  db.ping((error) => {
    if (error) {
      console.error(`Error pinging database: ${error}`);
      handleDatabaseError(error);
    }
  });
}, errorInterval);