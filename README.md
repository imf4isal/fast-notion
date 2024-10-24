# Fast-Notion

Fast-Notion is a command-line interface (CLI) tool for managing Notion databases directly from your terminal. It allows you to quickly add entries, set databases, and manage your Notion integration without leaving your command line.

## Installation

To install Fast-Notion globally, run: `npm install -g fast-notion`

## Usage

After installation, you can use the `noti` command to interact with Fast-Notion.

### Authorization

Before using Fast-Notion, you need to authorize it with your Notion account: `noti auth`

It will open a new browser window for you to authorize the app. If not, you can manually authorize the app by clicking [this link](https://www.notion.so/my-integrations) and then re-run the `noti auth` command.

To authorize Fast-Notion properly, please follow these steps:

1. Go to https://www.notion.so/my-integrations
2. Click on "New integration"
3. Give your integration a name (e.g., "Curate")
4. Select the associated workspace where you want to use this integration
5. Click "Save" to create the integration
6. On the next page, find and copy the "Internal Integration Secret". You may need to click on "Show" to see it.
7. Paste the secret on the terminal when prompted

Initial setup is done. Now you need to connect the page where you want to store your databases.

8. Go to your Notion workspace
9. Create a new page where you want to store your databases
10. Go to the page settings. 3 dot at top right corner.
11. Under the Connections section, select - Connnect to.
12. Select the integration you created earlier (e.g., "Curate")

Okay, now you're all set! These are just first-time setup if you don't run `noti unsync`.

`noti unsync` will remove the authorization.

### Set Current Database

To set or create a database: `noti set-db <your-database-name>`

This command will either connect to an existing database with the given name or create a new one.

### Add Entry

To add a new entry to the current database: `noti add <title> <url> <tag1>`

i.e. `noti add "My Favorite Website" https://www.google.com/ "Google,Search Engine"`

Note:

1. Inverted commas are optional if the title contains only one word. For multiple words, you must use inverted commas.
2. Tags are optional.
3. `tag1,tag2` and `"tag1,tag2"` are both valid.

## Motivation

Notion is a great tool for organizing your thoughts, ideas, and information.
However, navigating through the various pages and databases can be overwhelming. As a developer, I love the terminal, and I hope you do too.

Fast-Notion makes the curating process simple and fast directly from your terminal. And as we know, Fast is fun.

Have fun curating!
