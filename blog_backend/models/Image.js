const { Model } = require('objection');

class Image extends Model {
    static get tableName() {
        return 'Images';
    }

    static get jsonSchema() {
        return {
            required: ['image', 'blog_id'],
            properties: {
                id : { type : 'integer' },
                // image : { type : 'binary' } but there is no binary enforcement
                blog_id : { type : 'integer' }
            }
        };
    }

    static get relationMappings() {
        const Blog = require('./Blog.js');

        return {
            blog : {
                relation : Model.BelongsToOneRelation,
                modelClass : Blog,
                join : {
                    from : "Images.blog_id",
                    to : "Blogs.id"
                }
            }
        };
    }
}

module.exports = Image;