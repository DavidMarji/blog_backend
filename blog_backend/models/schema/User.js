const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'Users';
    }

    static get jsonSchema() {
        return {
            type : 'object',
            required: ['username', 'email', 'password'],
            properties: {
                id : { type : 'integer' },
                username : { type: 'string', minLength: 5, maxLength: 50 },
                password : { type: 'string', minLength: 5, maxLength: 100 },
                email : { type: 'string', minLength: 3, maxLength: 100 },
            }
        };
    }

    static get relationMappings() {
        const Blog = require('./Blog.js');

        return {
            blogs : {
                relation : Model.HasManyRelation,
                modelClass : Blog,

                join : {
                    from : 'Users.id',
                    to : "Blogs.author_id"
                }
            },
            unpublishedBlogs : {
                relation : Model.HasManyRelation,
                modelClass : Blog,

                join : {
                    from : 'Users.id',
                    to : "Blogs.author_id"
                },
                modify: builder => {
                    builder.where('published', false);
                }
            },
            publishedBlogs : {
                relation : Model.HasManyRelation,
                modelClass : Blog,

                join : {
                    from : 'Users.id',
                    to : "Blogs.author_id"
                },
                modify: builder => {
                    builder.where('published', true);
                }
            },
        };
    }
}

module.exports = User;