const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');

async function listDatabasesCommand() {
    const config = loadConfig();
    if (!config.notionToken) {
        console.log('Please run "noti auth" first to authorize.');
        return;
    }

    const notion = new Client({ auth: config.notionToken });

    try {
        const response = await notion.search({
            filter: { property: 'object', value: 'database' },
        });

        if (response.results.length > 0) {
            console.log('Your Notion databases:');
            response.results.forEach((database, index) => {
                console.log(
                    `${index + 1}. ${
                        database.title[0]?.plain_text || 'Untitled'
                    } (ID: ${database.id})`
                );
            });
        } else {
            console.log('No databases found in your Notion workspace.');
        }
    } catch (error) {
        console.error('Error listing databases:', error.message);
    }
}

module.exports = listDatabasesCommand;
