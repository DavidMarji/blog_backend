const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userController = require('./controllers/userController.js');
const pageController = require('./controllers/pageController.js');
const blogController = require('./controllers/blogController.js');
const imageController = require('./controllers/imageController.js');
const jwt = require('./utilities/jwt.js');
require('./models/knex.js');

app.listen(3000, () => console.log('Listening on 3000'));

app.use('*', (req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/favico.ico', (req, res) => {
    res.sendStatus(200);
});

app.use((req, res, next) => {
    const verified = jwt.verifyAccessToken(req.headers.authentication);
    if(req.path !== '/accounts/login/'
        && req.path !== '/accounts/signup/'){
        
        if(!verified.success){
            res.sendStatus(401);
            return;
        }
        req.sessionUsername = verified.data.username;
        req.sessionUserId = verified.data.id;
    }
    next();
});

app.use(userController);
app.use(blogController);
app.use(pageController);
app.use(imageController);