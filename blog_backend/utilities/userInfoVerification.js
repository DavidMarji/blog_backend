function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hasWhiteSpace(text) {
    const regex = / /;
    return regex.test(text);
}

const validateUserSignUp = function validateUserSignUp(usernameToSave, emailToSave, passwordToSave) {
    if(usernameToSave === null || usernameToSave === undefined || usernameToSave.length === 0  || hasWhiteSpace(usernameToSave)){
        // invalid username
        return 409;
    }

    if(emailToSave === null || emailToSave === undefined || emailToSave.length === 0 || !(isValidEmail(emailToSave))){
        // invalid email
        return 409;
    }

    if(passwordToSave === null || passwordToSave === undefined || passwordToSave.length == 0  
        || hasWhiteSpace(passwordToSave)){
        // invalid password
        return 409;
    }
    return 200;
}

const validateUserLogin = function validateUserLogin(username, password) {
    
    if(username === null || username === undefined || username.length === 0  || hasWhiteSpace(username)){
        // invalid username
        return 409;
    }

    if(password === null || password === undefined || password.length == 0  
        || hasWhiteSpace(password)){
        // invalid password
        return 409;
    }

    return 200;
}

module.exports = {validateUserSignUp, validateUserLogin};