// Importeer express uit de node_modules map
import * as path from 'path'
import * as dotenv from "dotenv"

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'


dotenv.config();

const url = "https://api.buurtcampus-oost.fdnd.nl/api/v1/stekjes";
const data = await fetch(url).then((response) => response.json());

const app = express()
const http = createServer(app)
const ioServer = new Server(http, {
  connectionStateRecovery: {
    // De tijdsduur voor recovery bij disconnect
    maxDisconnectionDuration: 2 * 60 * 1000,
    // Of middlewares geskipped moeten worden bij recovery (ivm login)
    skipMiddlewares: true,
  },
})
const historySize = 50

let history = []

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

  // Stuur de history
  client.emit('history', history)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {
    // Check de maximum lengte van de historie
    while (history.length > historySize) {
      history.shift()
    }
    // Voeg het toe aan de historie
    history.push(message)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`)
  })
})

// Stel ejs in als template engine en geef de 'views' map door
app.set("view engine", "ejs");
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));

// Maak een route voor het index
app.get("/", function (request, response) {
  response.render("index", data);
});

app.get("/toevoegen", (request, response) => {
  response.render("toevoegen");
});

// Maak een route voor het what-the-plant
app.get("/what-the-plant", function (request, response) {
  response.render("what-the-plant");
});

// Maak een route voor de stekjesbieb

app.get("/stekjesbieb", (request, response) => {
  response.render("stekjesbieb", data);
});

// Maak een route voor de new-plant

app.get("/new-plant", (request, response) => {
  response.render("new-plant", data);
});

// Maak een route voor de contact

app.get("/contact", (request, response) => {
  response.render("contact", data);
});

// Maak een route voor de chatbot
app.get("/chatbot", function (request, response) {
  response.render("chatbot");
});

// Stel het poortnummer in waar express op gaat luisteren
app.set("port", 9800);

// Start express op, haal het ingestelde poortnummer op
http.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
