const express = require("express");
const router = express.Router();
const pageHandler = require('../handlers/pageHandler.js');

// get a specific page of a blog
router.get('/blogs/:id/pages/:number/', (req, res) => {
    pageHandler.getPageFromBlog(req.params.id, req.params.number, req.sessionUserId)
    .then(blog => {
        res.status(200).json(blog);
    })
    .catch(error => {
        const code = parseInt(error.message);
        if(code !== NaN) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

// create a new page
router.post('/blogs/:id/pages/', (req, res) => {
    pageHandler.createNewPage(req.params.id, req.sessionUserId)
    .then(data => {
        res.status(200).json(data.page_content);
    })
    .catch(error => {
        const code = parseInt(error.message);
        if(code !== NaN) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

// update a page
router.put('/blogs/:id/pages/:number/', (req, res) => {
    pageHandler.updatePage(req.params.id, req.params.number, 
        req.body.newPageContent, req.sessionUserId)
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        const code = parseInt(error.message);
        if(code !== NaN) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

// delete a page
router.delete('/blogs/:id/pages/:number/', (req, res) => {
    pageHandler.deletePage(req.params.id, req.params.number, req.sessionUserId)
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        const code = parseInt(error.message);
        if(code !== NaN) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

module.exports = router;