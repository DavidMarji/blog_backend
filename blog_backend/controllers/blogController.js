const express = require('express');
const router = express.Router();

// get all published blogs
router.get('/blogs/all/', (req, res) => {
});

// search for a blog by its title
router.get('/blogs/titles/:title/', (req, res) => {
});

// get a blog by its id specific blog
router.get('/blogs/:id/', (req, res) => {
});

// create a blog
router.post('/blogs/', (req, res) => {
});

// publish a blog
router.put('/blogs/:id/', (req, res) => {
});

// update a blog's title
router.put('/blogs/:id/:title/', (req, res) => {
});

// delete a blog
router.delete('/blogs/:id/', (req, res) => {
});

// get all of a user's blogs
router.get('/accounts/:username/blogs/all', (req, res) => {
});

// get all of a user's unpublished blogs
router.get('/accounts/:username/blogs/unpublished/all', (req, res) => {
});

// get all of a user's published blogs
router.get('/accounts/:username/blogs/published/all', (req, res) => {
});

module.exports = router;