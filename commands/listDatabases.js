const { Client } = require('@notionhq/client');
const { loadConfig, saveConfig } = require('../utils/config');
const inquirer = require('inquirer');

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
            const choices = response.results.map((database) => ({
                name: database.title[0]?.plain_text || 'Untitled',
                value: database.id,
            }));

            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedDatabase',
                    message: 'Select a database:',
                    choices: choices,
                },
            ]);

            config.currentDatabase = answer.selectedDatabase;
            saveConfig(config);
            console.log(
                `Current database set to: ${
                    choices.find((c) => c.value === answer.selectedDatabase)
                        .name
                }`
            );
        } else {
            console.log('No databases found in your Notion workspace.');
        }
    } catch (error) {
        console.error('Error listing databases:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }
}

module.exports = listDatabasesCommand;
