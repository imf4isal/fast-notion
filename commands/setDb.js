const { Client } = require('@notionhq/client');
const { saveConfig, loadConfig } = require('../utils/config');

async function setDbCommand(dbname) {
    const config = loadConfig();
    if (!config.notionToken) {
        console.log('Please run "noti auth" first to authorize.');
        return;
    }

    const notion = new Client({ auth: config.notionToken });

    try {
        let response = await notion.search({
            query: dbname,
            filter: { property: 'object', value: 'database' },
        });

        console.log(response);

        let databaseId;

        if (response.results.length > 0) {
            databaseId = response.results[0].id;
            console.log(`Connected to existing database: ${dbname}`);
        } else {
            console.log(
                `Database "${dbname}" not found. Attempting to create a new one...`
            );

            // search for a page where we can create a database
            response = await notion.search({
                filter: { property: 'object', value: 'page' },
            });

            if (response.results.length > 0) {
                const parentPage = response.results[0];
                console.log(
                    `Creating new database in page: ${parentPage.properties.title.title[0].plain_text}`
                );

                const newDatabase = await notion.databases.create({
                    parent: { type: 'page_id', page_id: parentPage.id },
                    title: [{ type: 'text', text: { content: dbname } }],
                    properties: {
                        Title: { title: {} },
                        URL: { url: {} },
                        Tags: { multi_select: {} },
                    },
                });

                databaseId = newDatabase.id;
                console.log(`Created new database: ${dbname}`);
            } else {
                console.log('No parent page found to create the database.');
                console.log('Please follow these steps:');
                console.log('1. Go to your Notion workspace');
                console.log('2. Create a new page');
                console.log(
                    '3. Go to the page settings. 3 dot at top right corner.'
                );
                console.log(
                    '4. Under the Connections section, select - Connnect to.'
                );
                console.log('5. Run this command again');
                return;
            }
        }

        const config = loadConfig();
        config.currentDatabase = databaseId;
        saveConfig(config);

        console.log(`Current database set to: ${dbname}`);
    } catch (error) {
        console.error('Error setting/creating database:', error.message);
        if (error.body) {
            console.error('Error details:', error.body);
        }
    }
}

module.exports = setDbCommand;
