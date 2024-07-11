const Blog = require('../models/schema/Blog.js');
const User = require('../models/schema/User.js');
const Page = require('../models/schema/Page.js');
const Image = require('../models/schema/Image.js');

// get all published blogs (accessable to any logged in user)
const getAllPublishedBlogs = async function getAllPublishedBlogs() {

    // find all blogs that are published
    const blogs = await Blog.getAllPublishedBlogs();
    
    // if no blogs exist that is fine just return undefined and handle later
    return blogs;

}

// get on blog by its title
const getOneBlogByTitle = async function getOneBlogByTitle(title, userId) {

    const blog = await Blog.getOneBlogByTitle(title);

    // user tries to access an unpublished blog that they didn't create
    if(!blog.published && blog.author_id !== userId) throw new Error(401);

    return blog;
    
    //throws 401 and 404
}

const getAllUserBlogs = async function getAllUserBlogs(username, userId) {
    const user = await User.findOneUserByUsername(username);
    if(user.id !== userId) throw new Error(401);

    const userWithBlogs = await User.getAllUserBlogs(userId);
    // user has no blogs which is fine 
    return userWithBlogs ? userWithBlogs.blogs : [];
    // throws 404 and 401
}

const getAllUnpublishedUserBlogs = async function getAllUnpublishedUserBlogs(username, userId) {
    const user = await User.findOneUserByUsername(username);
    if(user.id !== userId) throw new Error(401);

    const userWithBlogs = await User.getAllUnpublishedUserBlogs(userId);

    // user has no unpublished blogs which is fine
    return userWithBlogs ? userWithBlogs.unpublishedBlogs : [];
    
    // throws 401 and 404
}

const getAllPublishedUserBlogs = async function getAllPublishedUserBlogs(username) {

    const userWithBlogs = await User.getAllPublishedUserBlogs(username);

    // user has no published blogs which is fine
    return userWithBlogs ? userWithBlogs.publishedBlogs : [];
    // throws 401 and 404
}

const updateBlogTitle = async function updateBlogTitle(id, newTitle, userId) {
    const blog = await getOneBlogById(id, userId);
    // another user tries to update a blog that they didn't create
    if(blog.author_id !== userId) throw new Error(401);

    return await Blog.updateBlogTitle(id, newTitle);
    // throws 401 and 404
}

const getOneBlogById = async function getOneBlogById(id, userId) {
    
    const blog = await Blog.getOneBlogById(id);
    // user tries to access unpublished blog that they didn't create
    if(!blog.published && blog.author_id !== userId) throw new Error(401);
    return blog;
    // throws 401 and 404
}

const createBlog = async function createBlog(title, userId) {
    
    try {
        const blog = await Blog.createBlog(title, userId);
        const page = await Page.createPage(blog.id, blog.number_of_pages + 1);
        return blog;
    }
    catch (error) {
        console.log(error.message);
        // repeated data for title (it should be unique)
        throw new Error(409);
    }

    // throws 401 and 409
}

const publishBlog = async function publishBlog(id, userId) {

    const blog = await getOneBlogById(id, userId);
    
    if(blog.published) throw new Error(409);
    if(blog.author_id !== userId) throw new Error(401);
    
    return await Blog.publishBlog(id);
    // throws 401 409 and 404
}   

const unpublishBlog = async function unpublishBlog(id, userId) {

    const blog = await getOneBlogById(id, userId);
    
    if(!blog.published) throw new Error(409);
    if(blog.author_id !== userId) throw new Error(401);
    
    return await Blog.unpublishBlog(id);
    
    // throws 401 404 and 409
}

const deleteBlog = async function deleteBlog(id, userId) {

    const blog = await getOneBlogById(id, userId);
    
    if(blog.author_id !== userId) throw new Error(401);

    const pages = await blog.getPagesFromBlog();
    for(const page of pages) {
        const images = await page.getPageImages();
        for(const image of images) {
            await image.deleteImage();
        }
    }
    // return number of rows deleted
    return await blog.deleteBlog();
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