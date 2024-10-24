const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    '.fast-notion'
);

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

module.exports = {
    saveConfig,
    loadConfig,
    configPath,
};
