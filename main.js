#!/usr/bin/env node

const { program } = require('commander');
const authCommand = require('./commands/auth');
const setDbCommand = require('./commands/setDb');
const addEntryCommand = require('./commands/addEntry');
const unsyncCommand = require('./commands/unsync');
const listDatabasesCommand = require('./commands/listDatabases');
const searchCommand = require('./commands/search');
const deleteCommand = require('./commands/delete');

const recordCommand = require('./commands/record');

const { version } = require('./package.json');

program
    .version(version, '-v, --version', 'output the current version')
    .description(
        'Fast-Notion. A CLI tool for curating fast in Notion databases.'
    );

program.command('auth').description('Authorize Notion').action(authCommand);

program
    .command('set-db <dbname>')
    .description('Set the current database or create a new one')
    .action(setDbCommand);

// program
//     .command('add [title] <url> [tags...]')
//     .description('Add a new entry to the current database')
//     .action(addEntryCommand);

program
    .command('add <input...>')
    .description('Add a new entry to the current database')
    .action((input) => {
        let title, url, tags;
        if (input[0].startsWith('http')) {
            url = input[0];
            tags = input.slice(1);
        } else {
            title = input[0];
            url = input[1];
            tags = input.slice(2);
        }
        addEntryCommand(title, url, tags);
    });

program
    .command('search <searchText>')
    .description('Search for entries in the current database')
    .action(searchCommand);

program
    .command('delete <input>')
    .description('Delete an entry from the current database')
    .action(deleteCommand);

program
    .command('unsync')
    .description('Remove Notion authorization')
    .action(unsyncCommand);

program
    .command('db')
    .description('List all databases in your Notion workspace')
    .action(listDatabasesCommand);

program
    .command('record')
    .description('Show all records in the selected database')
    .action(recordCommand);

program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ noti auth');
    console.log('  $ noti set-db "My Database"');
    console.log('  $ noti add "My Title" https://example.com tag1,tag2');
    console.log('  $ noti unsync');
    console.log('  $ noti db');
    console.log('  $ noti delete <pageId>');
    console.log('  $ noti search "SearchText"');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
