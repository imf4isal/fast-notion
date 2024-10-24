#!/usr/bin/env node

const { program } = require('commander');
const authCommand = require('./commands/auth');
const setDbCommand = require('./commands/setDb');
const addEntryCommand = require('./commands/addEntry');
const unsyncCommand = require('./commands/unsync');
const { version } = require('./package.json');

program
    .version(version, '-v, --version', 'output the current version')
    .description('Fast-Notion CLI for managing Notion databases');

program.command('auth').description('Authorize Notion').action(authCommand);

program
    .command('set-db <dbname>')
    .description('Set the current database or create a new one')
    .action(setDbCommand);

program
    .command('add <title> <url> [tags...]')
    .description('Add a new entry to the current database')
    .action(addEntryCommand);

program
    .command('unsync')
    .description('Remove Notion authorization')
    .action(unsyncCommand);

program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ noti auth');
    console.log('  $ noti set-db "My Database"');
    console.log('  $ noti add "My Title" https://example.com tag1,tag2');
    console.log('  $ noti unsync');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
