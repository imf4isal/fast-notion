const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');

async function deleteCommand(pageId) {
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
        if (!/^[a-f0-9-]+$/i.test(pageId)) {
            console.log(
                'Invalid page ID format. Please provide a valid Notion page ID.'
            );
            return;
        }

        const page = await notion.pages.retrieve({ page_id: pageId });

        if (page.parent.database_id !== config.currentDatabase) {
            console.log(
                'The specified page does not belong to the current database.'
            );
            return;
        }

        await notion.pages.update({
            page_id: pageId,
            archived: true,
        });

        console.log(`Entry with Page ID: ${pageId} deleted successfully.`);
    } catch (error) {
        if (error.status === 404) {
            console.log(
                'Entry not found. Please check the Page ID and try again.'
            );
        } else {
            console.error('Error deleting entry:', error.message);
        }
    }
}

module.exports = deleteCommand;
