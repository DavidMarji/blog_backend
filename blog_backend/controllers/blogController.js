const express = require('express');
const router = express.Router();
const blogHandler = require('../handlers/blogHandler.js');
const turnToInteger = require('../handlers/integerHandler.js').turnToInteger;

// the following middlewares have to be route specific because the app only receives '/'
router.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// get all published blogs
router.get('/blogs/', (req, res) => {
    blogHandler.getAllPublishedBlogs()
    .then(publishedBlogs => {
        res.status(200).json(publishedBlogs);
    })
    .catch(error => {
        console.log(error.message);
        res.sendStatus(520);
    });
});

// search for a blog by its title (returns an array of blogs that contain req.params.title)
router.get('/blogs/titles/:title/', (req, res) => {
    blogHandler.getBlogsByTitle(req.params.title, req.sessionUserId)
    .then(blogs => {
        res.status(200).json(blogs);
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

// get a blog by its id specific blog
router.get('/blogs/:id/', turnToInteger, (req, res) => {
    blogHandler.getOneBlogById(req.params.id, req.sessionUserId)
    .then(blog => {
        res.status(200).send(blog);
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

// create a blog
router.post('/blogs/', (req, res) => {
    blogHandler.createBlog(req.body.title, req.sessionUserId)
    .then(data => {
        res.status(200).json(data.id);
    })
    .catch(error => {
        const code = parseInt(error.message);
        console.log(code);
        if(code) {
            res.sendStatus(code);
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

// publish a blog
router.put('/blogs/:id/publish/', turnToInteger, (req, res) => {
    blogHandler.publishBlog(req.params.id, req.sessionUserId)
    .then(rowsAffected => {
        if(rowsAffected > 0) res.sendStatus(200);
        else res.sendStatus(520);
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
    })
});

// unpublish blog
router.put('/blogs/:id/unpublish/', turnToInteger, (req, res) => {
    blogHandler.unpublishBlog(req.params.id, req.sessionUserId)
    .then(rowsAffected => {
        if(rowsAffected > 0) res.sendStatus(200);
        else res.sendStatus(520);
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

// update a blog's title
router.put('/blogs/:id/', turnToInteger, (req, res) => {
    blogHandler.updateBlogTitle(req.params.id, req.body.title, req.sessionUserId)
    .then(rowsAffected => {
        if(rowsAffected > 0) res.sendStatus(200);
        else res.sendStatus(520);
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

// delete a blog
router.delete('/blogs/:id/', turnToInteger, (req, res) => {
    blogHandler.deleteBlog(req.params.id, req.sessionUserId)
    .then(() => {
        res.sendStatus(200);
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
    })
});

// get all of a user's blogs
router.get('/accounts/:username/blogs/', (req, res) => {
    blogHandler.getAllUserBlogs(req.params.username, req.sessionUserId)
    .then(blogs => {
        res.status(200).json(blogs);
    })
    .catch(error => {

        const code = parseInt(error.message);
        if(code) {
            res.sendStatus(code);
        }
        else {
            console.log(error);
            res.sendStatus(520);
        }
    });
});

// get all of a user's unpublished blogs
router.get('/accounts/:username/blogs/unpublished/', (req, res) => {
    blogHandler.getAllUnpublishedUserBlogs(req.params.username, req.sessionUserId)
    .then(blogs => {
        res.status(200).json(blogs);
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

// get all of a user's published blogs (view user profile)
router.get('/accounts/:username/blogs/published/', (req, res) => {
    blogHandler.getAllPublishedUserBlogs(req.params.username)
    .then(blogs => {
        res.status(200).json(blogs);
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