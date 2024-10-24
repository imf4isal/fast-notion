const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');

async function searchCommand(searchText) {
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
            filter: {
                or: [
                    {
                        property: 'Title',
                        title: {
                            contains: searchText,
                        },
                    },
                    {
                        property: 'URL',
                        url: {
                            contains: searchText,
                        },
                    },
                    {
                        property: 'Tags',
                        multi_select: {
                            contains: searchText,
                        },
                    },
                ],
            },
        });

        if (response.results.length > 0) {
            console.log(`Found ${response.results.length} results:`);
            response.results.forEach((page, index) => {
                const title =
                    page.properties.Title.title[0]?.plain_text || 'Untitled';
                const url = page.properties.URL.url || 'No URL';
                const tags =
                    page.properties.Tags.multi_select
                        .map((tag) => tag.name)
                        .join(', ') || 'No Tags';
                console.log(
                    `${index + 1}. Title: ${title}, URL: ${url}, Tags: ${tags}`
                );
            });
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Error searching entries:', error.message);
    }
}

module.exports = searchCommand;
