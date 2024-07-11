const Image = require('../models/schema/Image.js');
const getOnePage = require('./pageHandler.js').getPageFromBlog;

const getPageImages = async function getPageImages(blogId, pageNumber, userId) {
    const page = await getOnePage(blogId, pageNumber, userId);
    // it is fine if there are no images
    return await page.getPageImages();
    
    // throws 404, 400 (if page number < 1), and 401
}

const saveImage = async function saveImage(blogId, pageNumber, imagePath, userId) {
    
    // verified page is real and got it for its id
    const page = await getOnePage(blogId, pageNumber, userId);
    return await Image.createImage(imagePath, page.id);
    // throws 404, 400 (if page number < 1), and 401
}

const deleteImage = async function deleteImage(blogId, pageNumber, imageId, userId) {
    // verified page is real and got it for its id
    const page = await getOnePage(blogId, pageNumber, userId);
    // verified image exists
    const image = await Image.getImage(imageId);
    // delete and return num rows deleted
    return await image.deleteImage();

    // throws 404, 400 (if page num < 1), and 401
}

module.exports = {
    getPageImages,
    saveImage,
    deleteImage
};