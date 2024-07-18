const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/schema/User.js');
require('dotenv').config()

const secretKey = process.env.JWT_SECRET_KEY;

const generateAccessToken = function generateAccessToken(username, id) {
    const payload = {
       username : username,
       id : id
    };
    
    const options = { expiresIn: '24h' };
  
    return jsonwebtoken.sign(payload, secretKey, options);
}

const verifyAccessToken = async function verifyAccessToken(token) {
    try {
        const decoded = jsonwebtoken.verify(token, secretKey);

        const user = await User.findOneUserByUsername(decoded.username);
        if(!user) throw new Error(404);

        return {success : true, data : decoded };
    }
    catch (error) {
        return {success : false, error : error.message };
    }
}
// don't give any other files the secretkey
module.exports = {generateAccessToken, verifyAccessToken};