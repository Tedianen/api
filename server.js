const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const mysql = require("mysql2/promise");

// parse application/json, för att hantera att man POSTar med JSON
const bodyParser = require("body-parser");
const res = require("express/lib/response");

// Inställningar av servern.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function getDBConnnection() {
  // Här skapas ett databaskopplings-objekt med inställningar för att ansluta till servern och databasen.
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restapi",
  });
}

app.get("/", (req, res) => {
  res.send(`<h1>Doumentation EXEMPEL</h1>
  <ul><li> GET /users</li></ul>`);
});

app.get("/users", async function (req, res) {
  let connection = await getDBConnnection();
  let sql = `SELECT * FROM users`;
  let [results] = await connection.execute(sql);

  //res.json() skickar resultat som JSON till klienten
  res.json(results);
});

app.get("/users/:id", async function (req, res) {
  //kod här för att hantera anrop…
  let connection = await getDBConnnection();

  let sql = "SELECT * FROM users WHERE id = ?";
  let [results] = await connection.execute(sql, [req.params.id]);
  res.json(results[0]); //returnerar första objektet i arrayen
});

/*
  app.post() hanterar en http request med POST-metoden.
*/
app.post("/users", function (req, res) {
  // Data som postats till routen ligger i body-attributet på request-objektet.
  console.log(req.body);

  // POST ska skapa något så här kommer det behövas en INSERT
  let sql = `INSERT INTO ...`;
});
app.post("/users", async function (req, res) {
  //req.body innehåller det postade datat
  console.log(req.body);

  try {
    const register = async (req, res) => {
      const { Name, Username, email, password } = req.body;
      const salt = await bcrypt.gensalt(10);
      const hashedPasswordFromDB = await bcrypt.hash(password, salt);
    };
    let connection = await getDBConnnection();
    let sql = `INSERT INTO users (Username, Name, email, password)
   VALUES (?, ?, ?, ?)`;

    let [results] = await connection.execute(sql, [
      req.body.Username,
      req.body.Name,
      req.body.email,
      hashedPasswordFromDB,
    ]);

    //results innehåller metadata om vad som skapades i databasen
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Thy managed not to connect :(" });
  }
});

app.post("/login", async function (req, res) {
  //kod här för att hantera anrop…
  let sql = "SELECT * FROM users WHERE username = ?";
  let [results] = await connection.execute(sql, [req.body.username]);

  // Kontrollera att det fanns en user med det username i results
  let hashedPasswordFromDB = results[0].password; // lösenordet i databasen

  // Verifiera hash med bcrypt
  const isPasswordValid = await bcrypt.compare(
    req.body.password, //klartext, har skickats in
    hashedPasswordFromDB
  );

  if (isPasswordValid === true) {
    // Skicka info om användaren, utan känslig info som t.ex. hash
    res.send;
  } else {
    // Skicka felmeddelande
    res.status(400).json({ error: "Invalid credentials" });
  }
});

app.put("/users/:id", async function (req, res) {
  //kod här för att hantera anrop…
  let sql = `UPDATE users
    SET Username = ?, Name = ?, email = ?, password = ?
    WHERE id = ?`;

  let [results] = await connection.execute(sql, [
    req.body.Username,
    req.body.Name,
    req.body.email,
    req.body.password,
    req.params.id,
  ]);
  //kod här för att returnera data
  console.log(results);
  res.json(results);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
