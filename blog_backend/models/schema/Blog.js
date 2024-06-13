const { Model } = require('objection');

class Blog extends Model {
    static get tableName() {
        return 'Blogs';
    }

    static get jsonSchema() {
        return {
            type : 'object',
            required: ['author_id', 'title'],
            properties: {
                id : { type : 'integer' },
                author_id : { type : 'integer' },
                title : { type : 'string', minLength: 5, maxLength: 100 },
                published : { type : 'boolean' }
            }
        };
    }

    static get relationMappings() {
        const User = require('./User.js');
        const Page = require('../Page.js');

        return {
            author : {
                relation : Model.BelongsToOneRelation,
                modelClass : User,
                join : {
                    from : "Blogs.author_id",
                    to : "Users.id"
                }
            },

            pages : {
                relation : Model.HasManyRelation,
                modelClass : Page,
                join : {
                    from : "Blogs.id",
                    to : "Pages.blog_id"
                }
            }
        };
    }

    static async getAllPublishedBlogs() {
        return await Blog.query()
            .where('published', true);
    }

    static async getOneBlogByTitle(title) {
        return await Blog.query()
            .findOne({title : title})
            .throwIfNotFound({message : 404});
    }

    static async updateBlogTitle(id, newTitle) {
        return await Blog.query()
            .findById(id)
            .patch({
                title : newTitle
            });    
    }

    static async getOneBlogById(id) {
        return await Blog.query()
        .findById(id)
        // invalid id
        .throwIfNotFound({message : 404});
    }

    static async createBlog(title, author_id) {
        return await Blog.query()
            .insert({
                author_id : author_id,
                title : title,
                published : false
            });
    }

    static async publishBlog(id) {
        return await Blog.query()
            .findById(id)
            .patch({
                published : true
            });
    }

    static async unpublishBlog(id) {
        return await Blog.query()
            .findById(id)
            .patch({
                published : false
            });
    }

    static async deleteBlog(id) {
        return await Blog.query()
            .deleteById(id)
    }

    async getPageFromBlog(pageNumber) {
        return await this.$relatedQuery('pages')
            .where('page_number', pageNumber)
            .first();
    }

    async getPagesFromBlog() {
        return await this.$relatedQuery('pages');
    }

}

module.exports = Blog;