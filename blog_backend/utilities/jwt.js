const jsonwebtoken = require('jsonwebtoken');
// this is just an example program in a real environment work environment I wouldn't push the secret key and instead replace it with "xxx"
const secretKey = '940d4d28-003d-43ec-8fcf-df2453b7649e';

const generateAccessToken = function generateAccessToken(usernameToSave) {
    const payload = {
       username : usernameToSave
    };
    
    const options = { expiresIn: '24h' };
  
    return jsonwebtoken.sign(payload, secretKey, options);
}

const verifyAccessToken = function verifyAccessToken(token) {
    try {
        const decoded = jsonwebtoken.verify(token, secretKey);
        return {success : true, data : decoded };
    }
    catch (error) {
        return {success : false, error : error.message };
    }
}
// don't give any other files the secretkey
module.exports = {generateAccessToken, verifyAccessToken};