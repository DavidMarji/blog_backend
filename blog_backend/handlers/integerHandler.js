const turnToInteger = function turnToInteger(req, res, next) {
    const params = ['id', 'number', 'imageId'];

    for(const param of params){
        if (req.params[param] !== undefined) {
            req.params[param] = parseInt(req.params[param]);

            if (isNaN(req.params[param])) {
                res.sendStatus(409);
                return;
            }
        }
    };
    next();
}

module.exports = {
    turnToInteger
}