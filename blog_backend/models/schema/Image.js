const { Model } = require('objection');
const fs = require('fs');

class Image extends Model {
    static get tableName() {
        return 'Images';
    }

    static get jsonSchema() {
        return {
            type : 'object',
            required: ['imagePath', 'page_id'],
            properties: {
                id : { type : 'integer' },
                imagePath : { type : 'string', },
                page_id : { type : 'integer' }
            }
        };
    }

    static get relationMappings() {
        const Page = require('./Page.js');

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

    static async createImage(imagePath, pageId) {
        return await Image.query()
            .insert({
                imagePath : imagePath,
                page_id : pageId
            });
    }

    async deleteImage() {
        const fs = require('fs');
        fs.unlinkSync(this.imagePath);

        return await this.$query()
            .delete();
    }

    static async getImage(imageId) {
        return await Image.query()
            .findById(imageId)
            .throwIfNotFound({ message : 404 });
    }
}

module.exports = Image;