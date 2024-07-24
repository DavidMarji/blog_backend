const axios = require('axios');
require('dotenv').config();

const instance = axios.create({
    baseURL : process.env.USER_VERIFICATION_URL,
    headers : {'x-api-key': process.env.USER_VERIFICATION_KEY},
    timeout : '3000'
});

const validateUser = async function validateUser(email, username, password) {
    const response = await instance.post('/api/validation/', {
        "email" : email,
        "firstname" : username,
        "lastname" : username,
        "password" : password
    });
    return response.data[0];
};

module.exports = {
    validateUser,
};