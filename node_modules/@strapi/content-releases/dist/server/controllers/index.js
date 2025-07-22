'use strict';

var release = require('./release.js');
var releaseAction = require('./release-action.js');
var settings = require('./settings.js');

const controllers = {
    release,
    'release-action': releaseAction,
    settings
};

exports.controllers = controllers;
//# sourceMappingURL=index.js.map
