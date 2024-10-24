const fs = require('fs');
const { configPath } = require('../utils/config');

function unsyncCommand() {
    if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
        console.log(
            'Authorization removed successfully. You can reauthorize using "noti auth".'
        );
    } else {
        console.log(
            'No authorization found. You are not currently authorized.'
        );
    }
}

module.exports = unsyncCommand;
