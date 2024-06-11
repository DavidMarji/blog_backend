const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379
    },
});

// make redis cache the pages

(async () => {
    // Connect to redis server
    await client.connect();
})();

client.on('connect', async () => {
    console.log('Connected to redis!');
});

const savePage = async function savePage(id, pageContent) {
    return await client.set(id, pageContent, 'EX', 60 * 60 * 24);
}

const getPage = async function getPage(id) {
    return await client.get(id);
}

const updatePage = async function updatePage(id, newPageContent) {
    await client.del(id);
    return await savePage(id, newPageContent);
}

const deletePage = async function deletePage(id) {
    return await client.del(id);
}

module.exports = {savePage, getPage, updatePage, deletePage};