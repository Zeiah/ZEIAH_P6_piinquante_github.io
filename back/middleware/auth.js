// importer le package jsonwebtoken
const jwt = require('jsonwebtoken');

/************** middleware de vérification du token
* extraire le token du header authorization et le décoder
* définir une userId authentifiée pour chaque requête
***************************************************************/ 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {userId: userId,};
        next();
    }
    catch(error) {res.status(401).json({ error })}
}