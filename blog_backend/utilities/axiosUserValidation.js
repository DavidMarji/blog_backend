const axios = require('axios');
require('dotenv').config();

const instance = axios.create({
    baseURL : process.env.USER_VERIFICATION_URL,
    headers : {'x-api-key': process.env.USER_VERIFICATION_KEY},
    timeout : '3000'
});

const validateUser = async function validateUser(email, username) {
    const response = await instance.post('/api/validation/', {
        "email" : email,
        "phone" : "",
        "firstname" : username,
        "lastname" : username
    });
    const res = response.data[0];

    if(!res?.email?.valid) {
       throw new Error(res?.email?.reason); 
    }

    if(!res?.fullname?.valid) {
        throw new Error(res?.fullname?.reason);
    }
    return res;
};

const flagBadWord = async function flagBadWord(word) {
    await instance.post('/api/badwords', {
        "word" : word 
    });
};

const flagCelebrityName = async function flagCelebrityName(celebrityFirstName, celebrityLastName) {
    await instance.post('/api/celebritynames', {
        "firstname" : celebrityFirstName,
        "lastname" : celebrityLastName
    });
};

module.exports = {
    validateUser,
    flagBadWord,
    flagCelebrityName
};