// importer le modèle Sauce
const Sauce = require('../models/Sauce');

/****** Middleware du système des like (requête POST) ************************
* identifier la sauce likée par son id
* vérifier si le userId est présent dans les tableaux userLiked ou userDisliked
* mettre à jour la base de donnée
    - tableaux userLiked/userDisleked: ajouter ou retirer le userId
    - taleaux likes/dislikes : ajouter ou retirer un like/dislike
*******************************************************************************/
exports.likeUser = (req, res, next) => {
    //requête envoyée au format json avec 2 propriétés : userId et like (1, 0, -1)
    console.log("affichage requête like", req.body.like);
    console.log("affichage requête userId", req.body.userId);

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

/****** requête like = 1 ****************************
* le userId n'est pas ds tableau usersLiked
    - dans tableau likes ajouter +1
    - dans tableau userLiked ajouter userId
****************************************************/
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like == 1) {
                console.log("userId n'est pas ds base userLiked ET requête like=1");
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id,
                    })
                    .then(() => {res.status(201).json({ message: 'sauce likes +1' })})
                    .catch((error) => {res.status(400).json({ error })});
            };

/****** requête like = 0 ****************************
* le userId est ds tableau usersLiked
    - dans tableau likes retirer -1
    - dans tableau userLiked retirer userId
****************************************************/
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like == 0) {
                console.log("userId est ds base de donnée usersLiked ET requête like=0");
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId },
                        _id: req.params.id,
                    })
                    .then(() => {
                        res.status(201).json({ message: 'sauce likes 0' })})
                    .catch((error) => {res.status(400).json({ error })});
            };

/****** requête dislike = -1 ****************************
* le userId n'est pas ds tableau usersDisliked
    - dans tableau dislikes ajouter +1
    - dans tableau userDisliked ajouter userId
****************************************************/
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like == -1) {
                console.log("userId n'est pas ds base de donnée UserDisliked ET requête like=-1");
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id,
                    })
                    .then(() => {res.status(201).json({ message: 'sauce dislike +1' })})
                    .catch((error) => {res.status(400).json({ error })});
            };

/****** requête dislike = 0 ****************************
* le userId est ds tableau usersDisliked
    - dans tableau dislikes retirer -1
    - dans tableau userDisliked retirer userId
****************************************************/
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like == 0) {
                console.log("userId est ds base de donnée usersDisliked et requête like=0");
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId },
                        _id: req.params.id,
                    })
                    .then(() => {res.status(201).json({ message: 'sauce dislike 0' })})
                    .catch((error) => {res.status(400).json({ error })});
            }
        })
        .catch((error) => {
            res.status(404).json({ error }),
                console.log("échec systeme like");
        });
};