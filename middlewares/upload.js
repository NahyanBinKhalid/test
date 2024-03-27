const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname.toLowerCase().replace(" ", '-'));
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;

