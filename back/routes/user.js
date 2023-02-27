// importer express et créer un router
const express = require('express');
const router = express.Router();

//importer le fichier controllers user
const userCtrl = require('../controllers/user');

// routers pour les logiques signup et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exporter le router
module.exports = router;