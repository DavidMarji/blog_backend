const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userController = require('./controllers/userController.js');
const pageController = require('./controllers/pageController.js');
const blogController = require('./controllers/blogController.js');
const imageController = require('./controllers/imageController.js');
require('./models/knex.js');

app.listen(3000, () => console.log('Listening on 3000'));

app.use('*', (req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/static', express.static('public'))

app.use(userController);
app.use(blogController);
app.use(pageController);
app.use(imageController);