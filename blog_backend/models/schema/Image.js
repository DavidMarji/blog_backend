const { Model } = require('objection');

class Image extends Model {
    static get tableName() {
        return 'Images';
    }

    static get jsonSchema() {
        return {
            required: ['image', 'page_id'],
            properties: {
                id : { type : 'integer' },
                // image : { type : 'binary' } but there is no binary enforcement
                page_id : { type : 'integer' }
            }
        };
    }

    static get relationMappings() {
        const Page = require('../Page.js');

        return {
            page : {
                relation : Model.BelongsToOneRelation,
                modelClass : Page,
                join : {
                    from : "Images.page_id",
                    to : "Pages.id"
                }
            }
        };
    }
}

module.exports = Image;