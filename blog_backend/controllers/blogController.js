const express = require('express');
const router = express.Router();

// blog search page (gets the front page of all blogs in a list with all the blog ids)
router.get(/\/blogs\/all\/?$/, (req, res) => {
});

// search for a blog by its title
router.get(/\/blogs\/titles\/:title\/?$/, (req, res) => {
});

// specific blog page
router.get(/\/blogs\/:id\/?$/, (req, res) => {
});

// create a blog
router.post(/\/blogs\/?$/, (req, res) => {
});

// publish a blog
router.put(/\/blogs\/:id\/?$/, (req, res) => {
});

// update a blog's title
router.put(/\/blogs\/:id\/:title\/?$/, (req, res) => {
});

// delete a blog
router.delete(/\/blogs\/:id\/?$/, (req, res) => {
});

module.exports = router;