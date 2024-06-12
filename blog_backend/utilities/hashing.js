const crypto = require('crypto');

function hashText(text) {
	const hash = crypto.createHash('sha256');
	hash.update(text);
	return hash.digest('hex');
}

module.exports = { hashText };