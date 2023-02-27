// appeler les packages bcrypt + jsonwebtoken
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// appeler  le modèle User
const User = require('../models/User');


/***** Middleware signup : enregistrer un nouvel utilisateur (requête POST) **
* vérifier le format du mail et du password
* hacher le password avec bcrypt
* enregistrer l'utilisateur ds la base de donnée
*******************************************************************/
exports.signup = (req, res, next) => {

    // RegExp email
    const masqueEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    const testEmail = masqueEmail.test(req.body.email);
    console.log("résultat test email", testEmail);
    if (!testEmail) {
        res.status(401).json({ message: "erreur format Email" });
        return false;
    }

    /***** RegEpx password: 
     * 8 caractères
     * 1 minuscule
     * 1 majuscule
     * 1 chiffre 
     * 1 caractère spécial !@#$^&*
     ******************************/
    const masquePassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*])[0-9a-zA-Z].{8,}$/);
    const testPassword = masquePassword.test(req.body.password);
    console.log("résultat testPassword", testPassword);
    if (!testPassword) {
        res.status(401).json({ message: "erreur format password: 8 caractères min., au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (!@#$^&*)." });
        return false;
    } else {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash,
                });
                console.log(user);
                user.save()
                    .then(() => { res.status(201).json({ message: 'Utilisateur créé!' }) })
                    .catch(error => { res.status(400).json({ error }) })
            })
            .catch(error => res.status(500).json({ error }));
    }
};

/****** Middleware login : contrôler la connexion du User (requête POST) ******
* rechercher le User
* vérifier le password
* création d'un token d'authentification
* renvoyer le token au front-end avec la réponse
********************************************************************************/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' },
                                )
                            });
                        }
                    })
                    .catch(error => {res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {res.status(500).json({ error })});
};