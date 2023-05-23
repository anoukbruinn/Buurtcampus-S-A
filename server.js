// Importeer express uit de node_modules map
import * as dotenv from "dotenv";
import express, { request, response } from "express";

dotenv.config();

const url = "https://api.buurtcampus-oost.fdnd.nl/api/v1/stekjes";
const data = await fetch(url).then((response) => response.json());

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine en geef de 'views' map door
app.set("view engine", "ejs");
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));

// Maak een route voor het index
app.get("/", function (req, res) {
  res.render("index", data);
});

app.get("/toevoegen", (request, response) => {
  response.render("toevoegen");
});

// Maak een route voor het what-the-plant
app.get("/what-the-plant", function (req, res) {
  res.render("what-the-plant");
});

// Maak een route voor de stekjesbieb

app.get("/stekjesbieb", (request, response) => {
  response.render("stekjesbieb", data);
});

// Stel het poortnummer in waar express op gaat luisteren
app.set("port", 9800);

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
