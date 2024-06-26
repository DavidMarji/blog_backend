const express = require('express');
const router = express.Router();
const blogHandler = require('../handlers/blogHandler.js');

// get all published blogs
router.get('/blogs/all/', (req, res) => {
    blogHandler.getAllPublishedBlogs()
    .then(publishedBlogs => {
        res.status(200).json(publishedBlogs);
    })
    .catch(error => {
        console.log(error.message);
        res.sendStatus(520);
    });
});

// search for a blog by its title
router.get('/blogs/titles/:title/', (req, res) => {
    blogHandler.getOneBlogByTitle(req.params.title, req.sessionUserId)
    .then(blog => {
        res.status(200).json(blog);
    })
    .catch(error => {
        console.log(error.message);
        res.sendStatus(520);
    });
});

// get a blog by its id specific blog
router.get('/blogs/:id/', (req, res) => {
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
        console.log("this is data", data);
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
router.put('/blogs/:id/publish/', (req, res) => {
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
router.put('/blogs/:id/unpublish/', (req, res) => {
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
router.put('/blogs/:id/:title/', (req, res) => {
    blogHandler.updateBlogTitle(req.params.id, req.params.title, req.sessionUserId)
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
router.delete('/blogs/:id/', (req, res) => {
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
router.get('/accounts/current/blogs/all/', (req, res) => {
    blogHandler.getAllUserBlogs(req.sessionUserId)
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

// get all of a user's unpublished blogs
router.get('/accounts/current/blogs/unpublished/all/', (req, res) => {
    blogHandler.getAllUnpublishedUserBlogs(req.sessionUserId)
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
router.get('/accounts/:username/blogs/published/all/', (req, res) => {
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