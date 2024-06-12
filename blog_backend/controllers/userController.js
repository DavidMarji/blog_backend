const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/userHandler.js');

// account sign up
router.get('/accounts/signup/', (req, res) => {
});
  
// account login
router.get('/accounts/login/', (req, res) => {
});
  
// get the user profile
router.get('/accounts/:username/', (req, res) => {
});

// delete an account
router.delete('/accouts/:username/', (req, res) => {
});

module.exports = router;