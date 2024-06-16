const { Model } = require('objection');

class Page extends Model {
    static get tableName() {
        return 'Pages';
    }

    static get jsonSchema() {
        return {
            type : 'object',
            required: ['blog_id', 'page_content', 'page_number'],
            properties: {
                id : { type : 'integer' },
                blog_id : { type : 'integer' },
                page_content : { type : 'string', minLength : 0 },
                // need to test if minimum : 1 works
                page_number : { type: 'integer', minimum: 1 }
            }
        };
    }

    static get relationMappings() {
        const Image = require('./Image.js');
        const Blog = require('./Blog.js');

        return {
            blog : {
                relation : Model.BelongsToOneRelation,
                modelClass : Blog,
                join : {
                    from : "Pages.blog_id",
                    to : "Blogs.id"
                }
            },

            images : {
                relation : Model.HasManyRelation,
                modelClass : Image,
                join : {
                    from : "Pages.id",
                    to : "Images.page_id"
                }
            }
        };
    }

    static async createPage(blogId, pageNumber) {
        return await Page.query()
            .insert({
                blog_id : blogId,
                page_content : "",
                page_number : pageNumber,
            });
    }

    async updatePage(newPageContent) {
        return await this.$query().patch({
            page_content : newPageContent
        });
    }

    async deleteThisPage() {
        return await this.$query()
            .delete();
    }

    async getPageImages() {
        return await this.$relatedQuery('images');
    }
}

module.exports = Page;