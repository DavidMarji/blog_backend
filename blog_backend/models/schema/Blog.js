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
}

module.exports = Blog;