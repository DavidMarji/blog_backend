const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uuid = require('../utilities/hashing.js').generateUUID;
const turnToInteger = require('../handlers/integerHandler.js').turnToInteger;

router.use(express.static(path.join(__dirname, '..', 'public')));
const storage = multer.diskStorage({
    destination : function (req, file, cb) {
                    cb(null, path.join(__dirname, '..', 'public', 'images'));
                },
    filename : function(req, file, cb) {
        const uniqueFileName = uuid().toString();
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueFileName + fileExtension);
    }
});
const upload = multer({ storage : storage });
const imageHandler = require('../handlers/imageHandler.js');

// the following middlewares have to be route specific because the app only receives '/'
router.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// save an image after a user uploads it
router.post('/blogs/:id/pages/:number/images/', turnToInteger, imageHandler.verifyUserBeforeUpload,  upload.single('image'), (req, res) => {
    imageHandler.saveImage(req.params.id, req.params.number, req.file.path, req.sessionUserId)
    .then(image => {
        res.status(200).json({
            "image" : image,
            "imageUrl" : `http://localhost:3000/images/${req.file.filename}`
        });
    })
    .catch(error => {
        const code = parseInt(error);
        if(code) {
            res.sendStatus(code);
        }
        else {
            console.log(error);
            res.sendStatus(520);
        }
    });
});

// delete an image after a user wanted to delete it
router.delete('/blogs/:id/pages/:number/images/:imageId', turnToInteger, (req, res) => {
    imageHandler.deleteImage(req.params.id, req.params.number, req.params.imageId, req.sessionUserId)
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        const code = parseInt(error.message);
        if(code) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

module.exports = router;