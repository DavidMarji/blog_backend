const { Model } = require('objection');

class Image extends Model {
    static get tableName() {
        return 'Images';
    }

    static get jsonSchema() {
        return {
            type : 'object',
            required: ['image', 'page_id'],
            properties: {
                id : { type : 'integer' },
                image : { type : 'string', },
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

    static async createImage(image, pageId) {
        return await Image.query()
            .insert({
                image : image,
                page_id : pageId
            });
    }
}

module.exports = Image;