// importer express et créer un router
const express = require('express');
const router = express.Router();

// importer logique authentification du user
const auth = require('../middleware/auth');

// importer logique gestion des images
const multer = require('../middleware/multer.config');

// importer logique sauce
const sauceCtrl = require('../controllers/sauce');

// importer logique like
const likeCtrl = require('../controllers/like');

// router pour les logiques sauce et like
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, likeCtrl.likeUser);

// exporter le router
module.exports = router;
 