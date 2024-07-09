const jwt = require('../utilities/jwt.js');
const Page = require('../models/schema/Page.js');
const getOneBlog = require('./blogHandler.js').getOneBlogById;

const getPageFromBlog = async function getPageFromBlog(blogId, pageNumber, userId) {
    if(pageNumber < 1) throw new Error(400);
    const blog = await getOneBlog(blogId, userId);

    // find the blog's pages
    const page = await blog.getPageFromBlog(pageNumber);
    
    if(!page) throw new Error(404);
    return page;
    // throws 404, 400 (if page number < 1), and 401
};

const createNewPage = async function createNewPage(blogId, userId) {
    const blog = await getOneBlog(blogId, userId);
    if(blog.published) throw new Error(409);

    return await Page.createPage(blogId, blog.number_of_pages + 1);
    // throws 404, 401, and 409 when blog is already published
}

const updatePage = async function updatePage(blogId, pageNumber, newPageContent, userId) {

    const blog = await getOneBlog(blogId, userId);
    if(blog.author_id !== userId) throw new Error(401);

    // this checks if the page exists and gets it
    const page = await getPageFromBlog(blogId, pageNumber, userId);
    // returns num rows affected
    return await page.updatePage(newPageContent);

    // throws 404, 400 (if page number < 1), and 401
}

const deletePage = async function deletePage(blogId, pageNumber, userId){

    const blog = await getOneBlog(blogId, userId);
    if(blog.author_id !== userId) throw new Error(401);

    if(blog.number_of_pages === 1) throw new Error(403);

    const page = await getPageFromBlog(blogId, pageNumber, userId);
    const images = await page.getPageImages();

    for(let image of images) {
        await image.deleteImage();
    }

    return await page.deleteThisPage();  

    // throws 404, 400 (if page number < 1), 403, and 401
}

module.exports = {
    getPageFromBlog,
    createNewPage,
    updatePage,
    deletePage
};