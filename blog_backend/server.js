const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userController = require('./controllers/userController.js');
const pageController = require('./controllers/pageController.js');
const blogController = require('./controllers/blogController.js');
const imageController = require('./controllers/imageController.js');
const jwt = require('./utilities/jwt.js');
require('./models/knex.js');
const cors = require('cors');
require('dotenv').config();


app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/favico.ico', (req, res) => {
    res.sendStatus(200);
});

app.use(async (req, res, next) => {
    if (req.path.startsWith('/images/') || req.path === '/accounts/signup/' || req.path === '/accounts/login/') {
        return next();
    }
    const verified = await jwt.verifyAccessToken(req.headers.authentication);
    if (!verified.success) {
        res.sendStatus(401);
        return;
    }

    req.sessionUsername = verified.data.username;
    req.sessionUserId = parseInt(verified.data.id);
    next();
});

app.use(userController);
app.use(blogController);
app.use(pageController);
app.use(imageController);

// user tries to access a page that doesnt have rest mapping
app.get('*', (req, res) => {
    res.sendStatus(404);
});