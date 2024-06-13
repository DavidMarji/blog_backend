const Image = require('../models/schema/Image.js');
const getOnePage = require('./pageHandler.js').getPageFromBlog;

const getPageImages = async function getPageImages(blogId, pageNumber, accessToken) {
    const page = await getOnePage(blogId, pageNumber, accessToken);
    // it is fine if there are no images
    return await page.getPageImages();
    
    // throws 404, 400 (if page number < 1), and 401
}

const saveImage = async function saveImage(blogId, pageNumber, image, accesstoken) {
    
    // verified page is real and got it for its id
    const page = await getOnePage(blogId, pageNumber, accesstoken);
    return await Image.createImage(image, page.id);
    // throws 404, 400 (if page number < 1), and 401
}

const deleteImage = async function deleteImage(blogId, pageNumber, image, accessToken) {
    // verified page is real and got it for its id
    const page = await getOnePage(blogId, pageNumber, accessToken);
    return await Image.deleteImage(image, page.id);
}

module.exports = {
    getPageImages,
    saveImage,
    deleteImage
};