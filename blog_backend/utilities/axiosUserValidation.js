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
        "phone" : "",
        "firstname" : username,
        "lastname" : username,
        "password" : password
    });
    const res = response.data[0];

    if(!res?.email?.valid) {
       throw new Error(res?.email?.reason); 
    }

    if(!res?.fullname?.valid) {
        throw new Error(res?.fullname?.reason);
    }
    
    if(!res?.password?.valid) {
        throw new Error(res?.password?.reason);
    }

    return res;
};

module.exports = {
    validateUser,
};