// importer MongoDB
const mongoose = require('mongoose');

// Modèle de base de donnée pour enregistrer une sauce
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, default:0 },
    likes: { type: Number, default:0 },
    dislikes: { type: Number, default:0 },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true },
});

// exporter le modèle Sauce
module.exports = mongoose.model('Sauce', sauceSchema);