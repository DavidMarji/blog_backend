const crypto = require('crypto');

function hashText(text) {
	const hash = crypto.createHash('sha256');
	hash.update(text);
	return hash.digest('hex');
}

function generateUUID() {
	return crypto.randomUUID();
}

module.exports = {
	hashText, 
	generateUUID
};