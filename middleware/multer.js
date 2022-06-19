const multer = require('multer');




//----------------- Set Storage -------------------

const storage = multer.diskStorage({
    destination: function(req, file, callback){

        callback(null, 'uploads')

    }, filename: function(req, file, callback){

        const ext = file.originalname.substring(file.originalname.lastIndexOf('.'))

        callback(null, file.fieldname +'-'+ Date.now() + ext)

    }
})

store = multer({storage: storage});

module.exports = store;