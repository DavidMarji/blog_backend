const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uuid = require('../utilities/hashing.js').generateUUID;
const turnToInteger = require('../handlers/integerHandler.js').turnToInteger;

const storage = multer.diskStorage({
    destination : './images',
    filename : function(req, file, cb) {
        const uniqueFileName = uuid().toString();
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueFileName + fileExtension);
    }
});
const upload = multer({ storage : storage });
const archiver = require('archiver');
const imageHandler = require('../handlers/imageHandler.js');

// the following middlewares have to be route specific because the app only receives '/'
router.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// save an image after a user uploads it
router.post('/blogs/:id/pages/:number/images/', upload.single('image'), turnToInteger, (req, res) => {
    imageHandler.saveImage(req.params.id, req.params.number, req.file.path, req.sessionUserId)
    .then(image => {
        res.status(200).json(image);
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

router.use('/blogs/:id/pages/:number/images/', turnToInteger, async (req, res, next) => {
    try {
        const images = await imageHandler.getPageImages(req.params.id, req.params.number, req.sessionUserId);
        req.images = images;
        next();
    }
    catch (error) {
        const code = parseInt(error.message);
        if(code) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    }
});

// get page images
router.get('/blogs/:id/pages/:number/images/', (req, res) => {
    try {
        const images = req.images;
        if(!images || images.length === 0){
            res.sendStatus(404);
            return;
        } 
        const archive = archiver('zip', {zlib: {level: 9}});
        res.attachment('images.zip');
        archive.on('error', (err) => {
            res.status(500).send({ error: err.message });
        });
        archive.pipe(res);
    
        for(const image of images) {
            const imagePath = path.resolve(__dirname, image.path);
            const fileName = path.basename(imagePath);
            archive.file(imagePath, { name: fileName });
        };
        archive.finalize();
    }
    catch (error) {
        console.log(error.message);
        res.sendStatus(520);
    }
});

module.exports = router;