const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');

async function recordCommand() {
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

    try {
        const response = await notion.databases.query({
            database_id: config.currentDatabase,
        });

        if (response.results.length > 0) {
            console.log('Records in the selected database:');
            response.results.forEach((record, index) => {
                const pageId = record.id;
                const title =
                    record.properties.Title.title[0]?.plain_text || 'Untitled';
                const url = record.properties.URL.url || 'No URL';
                const tags =
                    record.properties.Tags.multi_select
                        .map((tag) => tag.name)
                        .join(', ') || 'No Tags';
                console.log(
                    `${
                        index + 1
                    }. Title: ${title}, URL: ${url}, Tags: ${tags}, Page ID: ${pageId}`
                );
            });
        } else {
            console.log('No records found in the selected database.');
        }
    } catch (error) {
        console.error('Error fetching records:', error.message);
    }
}

module.exports = recordCommand;
