// importer le modèle Sauce
const Sauce = require('../models/Sauce');

// importer fs  pr la gestion des fichiers
const fs = require('fs');


/******** Middleware de création d'une sauce avec chargement d'une image (requête POST)
* parser l'objet requête (car contient un fichier image)
* supprimer userId (sécurité)
* créer nouvel objet Sauce :
    - récupérer un userId authentifié
    - générer l'url de l'image
* enregister la sauce
******************************************************************/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    console.log(sauce);
    console.log(sauce.userId);

    sauce.save()
        .then(() => {res.status(201).json({ message: 'Sauce enregistrée!' })})
        .catch(error => {res.status(400).json({ error })});
};


// middleware : affichage de toutes les sauces (requête GET)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {res.status(200).json(sauces)}) 
        .catch(error => {res.status(400).json({ error })});
};


// middleware : affichage d'une sauce (requête GET)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {res.status(200).json(sauce)})
        .catch(error => res.status(404).json({ error }));
};

/****** middleware de modification d'une sauce (requête PUT)******* 
* 2 possibilités selon que l'image a été modifiée ou pas:
    - si oui parser requête et générer url de l'image
    - si non récupérer objet sauce modifié
* supprimer userId (sécurité) de l'objet sauce
* récupérer objet sauce et son id ds la base de donnée
* vérifier que le requérant est bien le propriétaire de l'objet
* mettre à jour la sauce
*******************************************************************/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId){
                res.status(403).json({ message : '403: unauthorized request' });
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => {res.status(200).json({ message : 'Sauce modifiée!' })})
                    .catch(error => {res.status(401).json({ error })});
            }
        })
        .catch((error) => {res.status(400).json({ error })});
};

/******** middleware de suppression d'une sauce (requête DELETE)
* identifier la sauce à supprimer par son id
* vérifier que le requérant est bien le propriétaire de l'objet 
* supprimer image du système de fichiers
* supprimer objet de la base de données
************************************************************************/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.statut(403).json({ message: '403 : unauthorised' })
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({ message : 'Sauce supprimée!' })})
                        .catch(error => res.status(401).json({ error }))
                });
            }
        })
        .catch( error => {res.status(500).json({ error })})
};