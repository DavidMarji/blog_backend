const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/userHandler.js');

// the following middlewares have to be route specific because the app only receives '/'
router.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// account sign up
router.post('/accounts/signup/', (req, res) => {
    userHandler.signUp(req.body.username, req.body.email, req.body.password)
    .then(jwt => {
        res.status(200).json(jwt);
    })
    .catch (error => {
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
  
// account login
router.post('/accounts/login/', (req, res) => {
    userHandler.login(req.body.username, req.body.password)
    .then(jwt => {
        res.status(200).json(jwt);
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
  
// get the user profile
router.get('/accounts/:username/', (req, res) => {
    userHandler.findOneUser(req.params.username)
    .then(user => {
        res.status(200).json(user);
    })
    .catch (error => {
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

// delete an account
router.delete('/accounts/:username/', (req, res) => {
    userHandler.deleteUser(req.params.username, req.sessionUserId)
    .then(data => {
        res.status(200).json(data);
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

module.exports = router;