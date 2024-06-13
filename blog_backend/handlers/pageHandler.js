const jwt = require('../utilities/jwt.js');
const Page = require('../models/schema/Page.js');
const Blog = require('../models/schema/Blog.js');

const getPageFromBlog = async function getPageFromBlog(blogId, pageNumber, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        if(pageNumber < 1) throw new Error(400);

        const blog = await Blog.query()
            .findById(blogId)
            .throwIfNotFound({ message : 404 });
        
        if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);

        // find the blog's pages
        const page = await blog.$relatedQuery('pages')
            .where('page_number', pageNumber)
            .first();
        
        if(!page) throw new Error(404);
        return page;
    }
    catch (error) {
        if(error.message === '404'
            || error.message === '400'
            || error.message === '401') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
};

const createNewPage = async function createNewPage(blogId, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(blogId)
            .throwIfNotFound({ message : 404 });
        
        /* 
            if a user tries to alter a published blog 
            or an unpublished blog that they didnt create, throw an error
        */
        if(!blog.published && blog.author_id !== verified.data.id) 
            throw new Error(401);
        else if(blog.published) throw new Error(409);

        const pages = await blog.$relatedQuery('pages');

        return await Page.query()
            .insert({
                blog_id : blogId,
                page_content : "",
                page_number : pages.length + 1,
            });
    }
    catch (error) {
        if(error.message === '404'
            || error.message === '401'
            || error.message === '409') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520);
    }
}

const updatePage = async function updatePage(blogId, pageNumber, newPageContent, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(blogId)
            .throwIfNotFound({ message : 404 });

        if(blog.author_id !== verified.data.id) throw new Error(401);

        // this checks if the page exists and gets it
        const page = await getPageFromBlog(blogId, pageNumber, accessToken);
        // returns num rows affected
        return await page.$query().patch({
            page_content : newPageContent
        });
    }
    catch (error) {
        if(error.message === '404'
            || error.message === '401'
            || error.message === '400') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520); 
    }
}

const deletePage = async function deletePage(blogId, pageNumber, accessToken){
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(blogId)
            .throwIfNotFound({ message : 404 });

        if(blog.author_id !== verified.data.id) throw new Error(401);

        const page = await getPageFromBlog(blogId, pageNumber, accessToken);
        return await page.$query().delete()
    }
    catch (error) {
        if(error.message === '404'
            || error.message === '401'
            || error.message === '400') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520); 
    }
}

module.exports = {
    getPageFromBlog,
    createNewPage,
    updatePage,
    deletePage
};