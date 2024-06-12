const express = require('express');
const router = express.Router();

// get page images
router.get('/blogs/:id/pages/:number/images/' , (req, res) => {
});

// save an image after a user uploads it
router.post('/blogs/:id/pages/:number/images/' , (req, res) => {
});

// delete an image after a user wanted to delete it
router.delete('/blogs/:id/pages/:number/images/' , (req, res) => {
});

module.exports = router;