const hashing = require('../utilities/hashing.js');
const userInfoVerification = require('../utilities/userInfoVerification.js');
const jwt = require('../utilities/jwt.js');
const User = require('../models/schema/User.js');

const findOneUser = async function findOneUser(username) {
    try {
        let user = await User.query()
            .findOne({ username : username });

        if(!user) 
            user = await User.query()
                .findOne({email : username})
                .throwIfNotFound({message : 404});

        return user;
    }
    catch (error) {
        if(error.message === '404') throw new Error(404);
             
        console.log(error.message);
        throw new Error(520);
    }
}

const signUp = async function signUp(username, email, password){
    
    if(password !== undefined && password !== null) password = hashing.hashText(password);
    const val = userInfoVerification.validateUserSignUp(username, email, password);
    // invalid inputs so throw an error
    if(val !== 200) throw new Error(val);
    
    try {
        // since the model has the unique keyword there is no need to check for this as it would throw an error

        const user = await User.query().insert({
            username : username,
            email : email,
            password : password
        });
        
        const generatedToken = jwt.generateAccessToken(username, user.id);
        return generatedToken; 
    }
    catch (error) {
        console.log(error.message);
        throw new Error(409);
    }
}

const login = async function login(username, password){

    if(password !== undefined && password !== null) password = hashing.hashText(password);

    const val = userInfoVerification.validateUserLogin(username, password);
    if(val !== 200) throw new Error(401);

    try {
        let user = await findOneUser(username);
        if(user.password !== password) throw new Error(401);

        const generatedToken = jwt.generateAccessToken(username, user.id);
        return generatedToken;
    }
    catch (error) {
        if(error.message === '401'
            || error.message === '404') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

// get the access token to ensure that nobody other than the user themself wants to delete their account
const deleteUser = async function deleteUser(username, accessToken) {

    // unauthorized
    const verified = jwt.verifyAccessToken(accessToken);
    if(!verified.success) throw new Error(401);
    
    try {
        let user = await findOneUser(username);
        if(user.username === verified.data.username) {
            // return number of rows deleted
            return await User
                .delete()
                .where('username', user.username);
        }
    }
    catch (error) {
        if(error.message === '404') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

module.exports = {signUp, login, findOneUser, deleteUser};