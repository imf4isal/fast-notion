#!/usr/bin/env node

const { program } = require('commander');
const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

dotenv.config();

const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    '.fast-notion'
);

//save config
function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// load config
function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

// authorization
program
    .command('auth')
    .description('Authorize Notion')
    .action(async () => {
        console.log('To authorize Fast-Notion, please follow these steps:');
        console.log('1. Go to https://www.notion.so/my-integrations');
        console.log('2. Click on "New integration"');
        console.log('3. Give your integration a name (e.g., "Curate")');
        console.log(
            '4. Select the associated workspace where you want to use this integration'
        );

        console.log('5. Click "Save" to create the integration');
        console.log(
            '6. On the next page, find and copy the "Internal Integration Secret". You may need to click on "Show" to see it.'
        );
        console.log('7. Paste the secret on the terminal when prompted');

        try {
            const open = await import('open');
            await open.default('https://www.notion.so/my-integrations');
        } catch (error) {
            console.error(
                'Failed to open URL automatically. Please open it manually in your browser.'
            );
        }

        const token = await promptForInput(
            'Enter your Notion Internal Integration Secret: '
        );
        const config = loadConfig();
        config.notionToken = token;
        saveConfig(config);
        console.log('Authorization successful!');
        console.log(
            'Important: Remember to connect your page with the integration in Notion.'
        );
    });

program.parse(process.argv);

function promptForInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
