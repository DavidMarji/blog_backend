const hashing = require('../utilities/hashing.js');
const userInfoVerification = require('../utilities/userInfoVerification.js');
const jwt = require('../utilities/jwt.js');
const User = require('../models/schema/User.js');
const deleteBlog = require('./blogHandler.js').deleteBlog;
const validateUser = require('../utilities/axiosUserValidation.js').validateUser;

const findOneUser = async function findOneUser(username) {
    
    let user = await User.findOneUserByUsername(username);

    if(!user) 
        user = await User.findOneUserByEmail(username);
    
    if(!user) throw new Error(404);
    return user;
    // throws 404
}

const findUsers = async function findUsers(username) {
    let users = await User.findUsersByUsername(username);

    return users;
}

const signUp = async function signUp(username, email, password){
    try {

        const response = await validateUser(email, username, password);
    }
    catch (error) {
        throw error;
    }

    email = email.toLowerCase();
    if(password !== undefined && password !== null) password = hashing.hashText(password);
    
    const val = userInfoVerification.validateUserSignUp(username, email, password);
    // invalid inputs so throw an error
    if(val !== 200) throw new Error(val);


    try {
        // since the model has the unique keyword there is no need to check for this as it would throw an error

        const user = await User.createUser(username, email, password);
        
        const generatedToken = jwt.generateAccessToken(username, user.id);
        return generatedToken; 
    }
    catch (error) {
        console.log(error.message);
        throw new Error(409);
    }
    // throws 409
}

const login = async function login(username, password){

    if(password !== undefined && password !== null) password = hashing.hashText(password);

    const val = userInfoVerification.validateUserLogin(username, password);
    if(val !== 200) throw new Error(401);

    let user = await findOneUser(username);
    if(user.password !== password) throw new Error(401);

    const generatedToken = jwt.generateAccessToken(username, user.id);
    return generatedToken;
    // throws 401 and 404
}

// get the access token to ensure that nobody other than the user themself wants to delete their account
const deleteUser = async function deleteUser(username, userId) {
    
    const user = await findOneUser(username);
    if(user.id === userId) {
        // return number of rows deleted
        const blogs = await user.getAllUserblogs();
        for(const blog of blogs) {
            await deleteBlog(blog.id, userId);
        }
        return await user.deleteUser();
    }
    else {
        throw new Error(401);
    }
    // throws 404
}

module.exports = {
    signUp, 
    login, 
    findOneUser, 
    deleteUser, 
    findUsers
};