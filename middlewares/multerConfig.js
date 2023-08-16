const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/', 
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename= path.basename(file.originalname, path.extname(file.originalname));

    cb(null, filename+ '-' + uniqueSuffix + ext); 
  },
});

const upload = multer({ storage: storage }).single('fileLink');

module.exports = upload;
