// Importeer express uit de node_modules map
import * as dotenv from "dotenv";
import express from 'express';

dotenv.config();

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine en geef de 'views' map door
app.set('view engine', 'ejs')
app.set('views', './views')

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))


// Maak een route voor het index
app.get('/', function (req, res) {
      res.render('index')
    })

// Maak een route voor het index
app.get('/what-the-plant', function (req, res) {
  res.render('what-the-plant')
})

// Stel het poortnummer in waar express op gaat luisteren
app.set('port', 9800)

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


