const hashing = require('../utilities/hashing.js');
const userInfoVerification = require('../utilities/userInfoVerification.js');
const jwt = require('../utilities/jwt.js');
const User = require('../models/schema/User.js');

const findOneUser = async function findOneUser(username) {
    try {
        let user = await User.query().findOne({ username : username });
        if(!user) user = await User.query().findOne({email : username});
        if(!user) throw new Error(404);

        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error(400);
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
        
        const generatedToken = jwt.generateAccessToken(username);
        return generatedToken; 
    }
    catch (error) {
        console.log(error);
        throw new Error(409);
    }
}

const login = async function login(username, password){

    // if(password !== undefined && password !== null) password = hashing.hashText(password);

    const val = userInfoVerification.validateUserLogin(username, password);
    if(val !== 200) throw new Error(val);

    try {
        let user = await findOneUser(username);

        const generatedToken = jwt.generateAccessToken(username);
        return generatedToken;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
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
            // return number of things deleted
            return await User
                .delete()
                .where('username', '=', user.username);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = {signUp, login, findOneUser, deleteUser};