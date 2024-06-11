const { Model } = require('objection');

class Blog extends Model {
    static get tableName() {
        return 'Blogs';
    }

    static get jsonSchema() {
        return {
            required: ['author_id', 'title'],
            properties: {
                id : { type : 'integer' },
                author_id : { type : 'integer' },
                title : { type : 'string', minLength: 5, maxLength: 100 },
                text : { type : 'string', minLength: 0 },
                published : { type : 'boolean' }
            }
        };
    }

    static get relationMappings() {
        const User = require('./User.js');
        const Image = require('./Image.js');

        return {
            author : {
                relation : Model.BelongsToOneRelation,
                modelClass : User,
                join : {
                    from : "Blogs.author_id",
                    to : "Users.id"
                }
            },

            images : {
                relation : Model.HasManyRelation,
                modelClass : Image,
                join : {
                    from : "Blogs.id",
                    to : "Images.blog_id"
                }
            }
        };
    }
}

module.exports = Blog;