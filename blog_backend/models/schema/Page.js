const { Model } = require('objection');
const Blog = require('./Blog.js');

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
                page_number : { type: 'integer', minimum: 1 }
            }
        };
    }

    static get relationMappings() {
        const Image = require('./Image.js');

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
        return await Page.transaction(async trx => {
            const createdPage = await Page.query(trx).insert({
                blog_id: blogId,
                page_content: "",
                page_number: pageNumber,
            });
        
            const update = await Blog.query(trx).patch({
                number_of_pages: Page.query(trx).count().where('blog_id', blogId)
            }).where('id', blogId);

            return createdPage;
        });
    }

    async updatePage(newPageContent) {
        return await this.$query().patch({
            page_content : newPageContent
        });
    }

    async deleteThisPage() {
        return await Page.transaction(async trx => {
            const pageNumber = this.page_number;
            const blogId = this.blog_id;

            const numRows = await this.$query(trx).delete();

            const update = await Blog.query(trx).patch({
                number_of_pages: Page.query(trx).count().where('blog_id', this.blog_id)
            }).where('id', this.blog_id);

            await Page.query(trx)
                .patch({
                    page_number: Page.raw('?? - 1', ['page_number'])
                })
                .where('blog_id', blogId)
                .andWhere('page_number', '>', pageNumber);

            return numRows;
        });
    }

    async getPageImages() {
        return await this.$relatedQuery('images');
    }

    async $beforeInsert(queryContext) {
        await super.$beforeInsert(queryContext);
        const blogId = this.blog_id;
        await Blog.query(queryContext.transaction).increment('number_of_pages', 1).where('id', blogId);
    }

    async $beforeDelete(queryContext) {
        await super.$beforeDelete(queryContext);
        const blogId = this.blog_id;
        await Blog.query(queryContext.transaction).decrement('number_of_pages', 1).where('id', blogId);
    }
}

module.exports = Page;