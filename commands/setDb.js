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

        let databaseId;

        if (response.results.length > 0) {
            databaseId = response.results[0].id;
            console.log(`Connected to existing database: ${dbname}`);
        } else {
            console.log(
                `Database "${dbname}" not found. Attempting to create a new one...`
            );

            response = await notion.search({
                filter: { property: 'object', value: 'page' },
            });

            console.log(`Found ${response.results.length} pages.`);

            if (response.results.length > 0) {
                const parentPage = response.results[0];

                let parentPageTitle = 'Untitled';
                if (
                    parentPage.properties &&
                    parentPage.properties.title &&
                    parentPage.properties.title.title &&
                    parentPage.properties.title.title.length > 0
                ) {
                    parentPageTitle =
                        parentPage.properties.title.title[0].plain_text;
                }

                console.log(
                    `Attempting to create new database in page: ${parentPageTitle} (ID: ${parentPage.id})`
                );

                try {
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
                    console.log(
                        `Created new database: ${dbname} (ID: ${databaseId})`
                    );
                } catch (createError) {
                    console.error(
                        'Error creating database:',
                        createError.message
                    );
                    if (createError.body) {
                        console.error(
                            'Error details:',
                            JSON.stringify(createError.body, null, 2)
                        );
                    }
                    console.log(
                        'Please ensure that your integration has the necessary permissions to create databases.'
                    );
                    return;
                }
            } else {
                console.log('No parent page found to create the database.');
                console.log('Please follow these steps:');
                console.log('1. Go to your Notion workspace');
                console.log('2. Create a new page');
                console.log(
                    '3. Go to the page settings (3 dots at top right corner)'
                );
                console.log(
                    '4. Under the Connections section, select your integration'
                );
                console.log('5. Run this command again');
                return;
            }
        }

        config.currentDatabase = databaseId;
        saveConfig(config);
        console.log(`Current database set to: ${dbname}`);
    } catch (error) {
        console.error('Error setting/creating database:', error.message);
        if (error.body) {
            console.error(
                'Error details:',
                JSON.stringify(error.body, null, 2)
            );
        }
    }
}

module.exports = setDbCommand;
