'use strict';

var release = require('./release.js');
var releaseAction = require('./release-action.js');
var settings = require('./settings.js');

const routes = {
    settings,
    release,
    'release-action': releaseAction
};

exports.routes = routes;
//# sourceMappingURL=index.js.map
