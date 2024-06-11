const { Model } = require('objection');

class Page extends Model {
    static get tableName() {
        return 'Pages';
    }

    static get jsonSchema() {
        return {
            required: ['blog_id', 'page_content'],
            properties: {
                id : { type : 'integer' },
                blog_id: { type : 'integer' },
                page_content: { type : 'string', minLength : 0 }
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
}

module.exports = Page;