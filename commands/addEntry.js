const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');

async function addEntryCommand(title, url, tags) {
    const config = loadConfig();
    if (!config.notionToken) {
        console.log('Please run "noti auth" first to authorize.');
        return;
    }

    if (!config.currentDatabase) {
        console.log(
            'Please set a current database using "noti set-db <dbname>" first.'
        );
        return;
    }

    const notion = new Client({ auth: config.notionToken });

    const tagList =
        tags.length > 0
            ? tags
                  .join(' ')
                  .split(',')
                  .map((tag) => tag.trim())
            : [];

    try {
        await notion.pages.create({
            parent: { database_id: config.currentDatabase },
            properties: {
                Title: { title: [{ text: { content: title } }] },
                URL: { url: url },
                Tags: {
                    multi_select: tagList.map((tag) => ({ name: tag })),
                },
            },
        });
        console.log('Entry added successfully!');
    } catch (error) {
        console.error('Error adding entry:', error.message);
    }
}

module.exports = addEntryCommand;
