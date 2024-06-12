const jwt = require('../utilities/jwt.js');
const Blog = require('../models/schema/Blog.js');
const Page = require('../models/schema/Page.js');
const User = require('../models/schema/User.js');

// get all published blogs (accessable to any logged in user)
const getAllPublishedBlogs = async function getAllPublishedBlogs(accessToken) {
    
    const verified  = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        // find all blogs that are published
        const blogs = await Blog.query()
            .where('published', true);
        
        // if no blogs exist that is fine just return undefined and handle later
        return blogs;
    }
    catch(error) {
        if(error.message === '401') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

// get on blog by its title
const getOneBlogByTitle = async function getOneBlogByTitle(title, accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findOne({title : title})
            .throwIfNotFound({message : 404});
    
        // user tries to access an unpublished blog that they didn't create
        if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);

        return blog;
    }
    catch(error) {
        if(error.message === '401'
            || error.message === '404') throw new Error(error.message);
            
        console.log(error.message);
        throw new Error(520)
    }
}

const getAllUserBlogs = async function getAllUserBlogs(accessToken) {

    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const userBlogs = await User.query()
            .withGraphFetched('blogs');

        // user has no blogs which is fine 
        if(!userBlogs) return undefined;
        return userBlogs.blogs;
    }
    catch(error) {
        if(error.message === '401') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520);
    }
}

const getAllUnpublishedUserBlogs = async function getAllUnpublishedUserBlogs(accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const userBlogs = await User.query()
            .findById(verified.data.id)
            .withGraphFetched('unpublishedBlogs');

        // user has no unpublished blogs which is fine
        if(!userBlogs) return undefined;
        return userBlogs.blogs;
    }
    catch (error) {
        if(error.message === '401') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

const getAllPublishedUserBlogs = async function getAllPublishedUserBlogs(accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const userBlogs = await User.query()
            .findById(verified.data.id)
            .withGraphFetched('publishedBlogs');

        // user has no published blogs which is fine
        if(!userBlogs) return undefined;
        return userBlogs.blogs;
    }
    catch (error) {
        if(error.message === '401') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520);
    }
}

const updateBlogTitle = async function updateBlogTitle(id, newTitle, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(id)
            // blog with the given id doesnt exist

            .throwIfNotFound({message : 404});
        // another user tries to update a blog that they didn't create
        if(blog.author_id !== verified.data.id) throw new Error(401);

        return await Blog.query()
            .update({title : newTitle})
            .where('id', id);
    }
    catch(error) {

        if(error.message === '401'
            || error.message === '404') throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

const getOneBlogById = async function getOneBlogById(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(id)
            // invalid id
            .throwIfNotFound({message : 404});
        
        // user tries to access unpublished blog that they didn't create
        if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);
        return blog;
    }
    catch (error) {
        if(error.message === "401" 
            || error.message === "404") throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520);
    }
}

const createBlog = async function createBlog(title, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);
    
    try {
        Blog.query()
            .insert({
                author_id : verified.data.id,
                title : title,
                published : false
            });
    }
    catch (error) {
        console.log(error.message);
        // repeated data for title (it should be unique)
        throw new Error(409);
    }
}

const publishBlog = async function publishBlog(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(id)
            .throwIfNotFound({message : 404});
        
        if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);
        
        return await Blog.query()
            .update({ published : true })
            .where('id', id);
    }
    catch (error) {
        if(error.message === '404'
            || error.message === '401') throw new Error(error.message);
        
        console.log(error.message);
        throw new Error(520);
    }
}   

const deleteBlog = async function deleteBlog(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    try {
        const blog = await Blog.query()
            .findById(id)
            .throwIfNotFound({ message : 404 });
        
        if(!blog.published && blog.author_id === verified.data.id) throw new Error(401);

        // return number of rows deleted
        return await Blog.query()
            .deleteById(id);
    }
    catch (error) {
        if(error.message === "404"
            || error.message === "401") throw new Error(error.message);

        console.log(error.message);
        throw new Error(520);
    }
}

module.exports = {
    getAllPublishedBlogs,
    getOneBlogByTitle, 
    getAllUserBlogs, 
    getAllUnpublishedUserBlogs, 
    getAllPublishedUserBlogs,
    updateBlogTitle,
    getOneBlogById,
    createBlog,
    publishBlog,
    deleteBlog
};