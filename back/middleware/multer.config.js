// importer package multer
const multer = require('multer');

//dictionnaire des types de fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

/************ middleware gestion de l'image **********************
* créer un objet de configuration pour multer en lui indiquant comment gérer les fichiers
    - destination : indiquer ds quel dossier stocker le fichier
    - filename : indiquer quel nom de fichier utiliser 
        * générer un nom
        * donner une extension
        * rendre unique le fichier
*******************************************************************/
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extention);
    }
});

// exporter la méthode multer
module.exports = multer({storage : storage}).single('image');