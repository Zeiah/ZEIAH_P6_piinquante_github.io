// importer MongoDB
const mongoose = require('mongoose');

//importer pluggin unique validator
const uniqueValidator = require('mongoose-unique-validator');

//Modèle de base de donnée pour enregistrer un utilisateur
const userSchema = mongoose.Schema ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

// empêcher que plusieurs utilisateurs utilisent le même email
userSchema.plugin(uniqueValidator);

// Exporter le modèle User
module.exports = mongoose.model('User', userSchema);