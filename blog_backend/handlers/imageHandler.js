const Image = require('../models/schema/Image.js');
const getOnePage = require('./pageHandler.js').getPageFromBlog;
const getBlogById = require('./blogHandler.js').getOneBlogById;

const verifyUserBeforeUpload = async function verifyUserBeforeUpload(req, res, next) {
    if(req.method === "POST") {
        try {
            // getBlogById checks if the user has access to the blog
            const blog = await getBlogById(req.params.id, req.sessionUserId);

            // user is not allowed to add images to an already published blog
            if(blog.published){
                res.sendStatus(403);
                return;
            } 
        }
        catch (error) {
            const code = parseInt(error);
            if(code) {
                res.sendStatus(code);
            }
            else {
                console.log(error);
                res.sendStatus(520);
            }
        }
    }
    next();
}

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
    verifyUserBeforeUpload,
    getPageImages,
    saveImage,
    deleteImage,
};