const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/userHandler.js');

// account sign up
router.post('/accounts/signup/', (req, res) => {
    userHandler.signUp(req.body.username, req.body.email, req.body.password)
    .then(jwt => {
        res.status(200).json(jwt);
    })
    .catch (error => {
        if(error.message.parseInt() !== NaN) {
            res.sendStatus(error.message.parseInt());
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});
  
// account login
router.post('/accounts/login/', (req, res) => {
    userHandler.login(req.body.username, req.body.password)
    .then(jwt => {
        res.status(200).json(jwt);
    })
    .catch(error => {
        if(error.message.parseInt() !== NaN) {
            res.sendStatus(error.message.parseInt());
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});
  
// get the user profile
router.get('/accounts/:username/', (req, res) => {
    userHandler.findOneUser(req.body.username)
    .then(user => {
        res.status(200).json(user);
    })
    .catch (error => {
        if(error.message.parseInt() !== NaN) {
            res.sendStatus(error.message.parseInt());
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

// delete an account
router.delete('/accouts/:username/', (req, res) => {
    userHandler.deleteUser(req.body.username, req.sessionUserId)
    .then(data => {
        console.log(data);
        res.sendStatus(200);
    })
    .catch(error => {
        if(error.message.parseInt() !== NaN) {
            res.sendStatus(error.message.parseInt());
        }
        else {
            console.log(error.message);
            res.sendStatus(520);
        }
    });
});

module.exports = router;