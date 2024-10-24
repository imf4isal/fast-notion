const { Client } = require('@notionhq/client');
const { loadConfig } = require('../utils/config');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchPageDetails(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $('title').text();
        const icon =
            $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href');
        const absoluteIcon =
            icon && !icon.startsWith('http') ? new URL(icon, url).href : icon;

        return { title, icon: absoluteIcon };
    } catch (error) {
        console.error('Error fetching page details:', error.message);
        return { title: null, icon: null };
    }
}

async function addEntryCommand(title, url, tags) {
    if (!url) {
        console.error('Error: URL is required');
        return;
    }

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

    const tagList = tags.length > 0 ? tags.map((tag) => tag.trim()) : [];

    let pageTitle = title;
    let pageIcon = null;

    const pageDetails = await fetchPageDetails(url);
    pageIcon = pageDetails.icon;

    if (!title) {
        pageTitle = pageDetails.title;
    }

    try {
        await notion.pages.create({
            parent: { database_id: config.currentDatabase },
            properties: {
                Title: {
                    title: [{ text: { content: pageTitle || 'Untitled' } }],
                },
                URL: { url: url },
                Tags: {
                    multi_select: tagList.map((tag) => ({ name: tag })),
                },
            },
            icon: pageIcon
                ? { type: 'external', external: { url: pageIcon } }
                : undefined,
        });
        console.log('Entry added successfully!');
    } catch (error) {
        console.error('Error adding entry:', error.message);
    }
}

module.exports = addEntryCommand;
