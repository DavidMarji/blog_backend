const jwt = require('../utilities/jwt.js');
const Page = require('../models/schema/Page.js');
const getOneBlog = require('./blogHandler.js').getOneBlogById;

const getPageFromBlog = async function getPageFromBlog(blogId, pageNumber, accessToken) {
    
    if(pageNumber < 1) throw new Error(400);
    const blog = await getOneBlog(blogId, accessToken);

    // find the blog's pages
    const page = await blog.getPageFromBlog(pageNumber);
    
    if(!page) throw new Error(404);
    return page;
    // throws 404, 400 (if page number < 1), and 401
};

const createNewPage = async function createNewPage(blogId, accessToken) {
    
    const blog = await getOneBlog(blogId, accessToken);
    if(blog.published) throw new Error(409);

    const pages = await blog.getPagesFromBlog();
    return await Page.createPage(blogId, pages.length + 1);
    // throws 404, 401, and 409 when blog is already published
}

const updatePage = async function updatePage(blogId, pageNumber, newPageContent, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await getOneBlog(blogId, accessToken);
    if(blog.author_id !== verified.data.id) throw new Error(401);

    // this checks if the page exists and gets it
    const page = await getPageFromBlog(blogId, pageNumber, accessToken);
    // returns num rows affected
    return await page.updatePage(newPageContent);

    // throws 404, 400 (if page number < 1), and 401
}

const deletePage = async function deletePage(blogId, pageNumber, accessToken){
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await getOneBlog(blogId, accessToken);
    if(blog.author_id !== verified.data.id) throw new Error(401);

    const page = await getPageFromBlog(blogId, pageNumber, accessToken);
    return await page.deleteThisPage();  

    // throws 404, 400 (if page number < 1), and 401
}

module.exports = {
    getPageFromBlog,
    createNewPage,
    updatePage,
    deletePage
};