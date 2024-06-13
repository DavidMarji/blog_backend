const jwt = require('../utilities/jwt.js');
const Blog = require('../models/schema/Blog.js');
const User = require('../models/schema/User.js');

// get all published blogs (accessable to any logged in user)
const getAllPublishedBlogs = async function getAllPublishedBlogs(accessToken) {
    
    const verified  = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    // find all blogs that are published
    const blogs = await Blog.getAllPublishedBlogs();
    
    // if no blogs exist that is fine just return undefined and handle later
    return blogs;

    // only throws 401
}

// get on blog by its title
const getOneBlogByTitle = async function getOneBlogByTitle(title, accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await Blog.getOneBlogByTitle(title);

    // user tries to access an unpublished blog that they didn't create
    if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);

    return blog;
    
    //throws 401 and 404
}

const getAllUserBlogs = async function getAllUserBlogs(accessToken) {

    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const userWithBlogs = await User.getAllUserBlogs(verified.data.id);

    // user has no blogs which is fine 
    return userWithBlogs ? userWithBlogs.blogs : [];
    // throws 401 and 404
}

const getAllUnpublishedUserBlogs = async function getAllUnpublishedUserBlogs(accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);
    const userWithBlogs = await User.getAllUnpublishedUserBlogs(verified.data.id);

    // user has no unpublished blogs which is fine
    return userWithBlogs ? userWithBlogs.unpublishedBlogs : [];
    
    // throws 401 and 404
}

const getAllPublishedUserBlogs = async function getAllPublishedUserBlogs(accessToken) {
    
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const userWithBlogs = await User.getAllPublishedUserBlogs(verified.data.id);

    // user has no published blogs which is fine
    return userWithBlogs ? userWithBlogs.publishedBlogs : [];
    // throws 401 and 404
}

const updateBlogTitle = async function updateBlogTitle(id, newTitle, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await getOneBlogById(id, accessToken);
    // another user tries to update a blog that they didn't create
    if(blog.author_id !== verified.data.id) throw new Error(401);

    return await Blog.updateBlogTitle(id, newTitle);
    // throws 401 and 404
}

const getOneBlogById = async function getOneBlogById(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);
    
    const blog = await Blog.getOneBlogById(id);
    
    // user tries to access unpublished blog that they didn't create
    if(!blog.published && blog.author_id !== verified.data.id) throw new Error(401);
    return blog;
    // throws 401 and 404
}

const createBlog = async function createBlog(title, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);
    
    try {
        return await Blog.createBlog(title, verified.data.id);
    }
    catch (error) {
        console.log(error.message);
        // repeated data for title (it should be unique)
        throw new Error(409);
    }

    // throws 401 and 409
}

const publishBlog = async function publishBlog(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await getOneBlogById(id, accessToken);
    
    if(blog.published) throw new Error(409);
    if(blog.author_id !== verified.data.id) throw new Error(401);
    
    return await Blog.publishBlog(id);
    // throws 401 409 and 404
}   

const unpublishBlog = async function unpublishBlog(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);

    const blog = await getOneBlogById(id, accessToken);
    
    if(!blog.published) throw new Error(409);
    if(blog.author_id !== verified.data.id) throw new Error(401);
    
    return await Blog.unpublishBlog(id);
    
    // throws 401 404 and 409
}

const deleteBlog = async function deleteBlog(id, accessToken) {
    const verified = jwt.verifyAccessToken(accessToken);
    // unauthorized
    if(!verified.success) throw new Error(401);
    const blog = await getOneBlogById(id, accessToken);
    
    if(blog.author_id === verified.data.id) throw new Error(401);

    // return number of rows deleted
    return await Blog.deleteBlog(id);
    // throws 404 and 401
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
    unpublishBlog,
    deleteBlog
};