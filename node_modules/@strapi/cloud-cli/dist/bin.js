'use strict';

var commander = require('commander');
require('axios');
require('fs-extra');
require('os');
require('./config/api.js');
require('path');
require('xdg-app-paths');
require('lodash');
require('jwks-rsa');
require('jsonwebtoken');
var logger = require('./services/logger.js');
var index = require('./index.js');

function loadStrapiCloudCommand(argv = process.argv, command = new commander.Command()) {
    // Initial program setup
    command.storeOptionsAsProperties(false).allowUnknownOption(true);
    // Help command
    command.helpOption('-h, --help', 'Display help for command');
    command.addHelpCommand('help [command]', 'Display help for command');
    const cwd = process.cwd();
    const hasDebug = argv.includes('--debug');
    const hasSilent = argv.includes('--silent');
    const logger$1 = logger.createLogger({
        debug: hasDebug,
        silent: hasSilent,
        timestamp: false
    });
    const ctx = {
        cwd,
        logger: logger$1
    };
    index.buildStrapiCloudCommands({
        command,
        ctx,
        argv
    });
}
function runStrapiCloudCommand(argv = process.argv, command = new commander.Command()) {
    loadStrapiCloudCommand(argv, command);
    command.parse(argv);
}

exports.runStrapiCloudCommand = runStrapiCloudCommand;
//# sourceMappingURL=bin.js.map
