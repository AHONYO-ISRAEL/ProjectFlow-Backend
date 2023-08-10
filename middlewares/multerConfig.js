const multer  = require('multer')

const  storage = multer.diskStorage({
    destination:  function (req,file,cb) {
        return cb(null, "./files")
    },
    filename: function(req, file, cb){
        return  cb(null, `${Date.now()}-${file.originalname}`)
    }
})


module.exports =  multer({storage}).single('file')