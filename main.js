#!/usr/bin/env node

const { program } = require('commander');
const authCommand = require('./commands/auth');
const setDbCommand = require('./commands/setDb');
const addEntryCommand = require('./commands/addEntry');
const unsyncCommand = require('./commands/unsync');

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

program.parse(process.argv);
