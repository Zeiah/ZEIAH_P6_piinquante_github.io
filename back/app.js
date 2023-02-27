// importation de Express
const express = require('express');

// importation des variables d'environnement
require('dotenv').config();

// importation de MongoDB
const mongoose = require('mongoose');

// importation des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// importation du path
const path = require('path');

// connexion à la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.USER_BDD}:${process.env.PASSWORD_BDD}@cluster0.ydw6h7k.mongodb.net/?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log('La connexion à MongoDB a réussie!'))
    .catch(() => console.log('La connexion à MongoDB a échouée!'));


// créer une application Express
const app = express();

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Fonction express.json : récupérer et afficher requêtes sous format json
app.use(express.json());


//Routes
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//exporter fichier app.js
module.exports = app;