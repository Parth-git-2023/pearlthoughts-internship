'use strict';

var admin = require('./admin.js');
var coreStore = require('./coreStore.js');
var cron = require('./cron.js');
var registries = require('./registries.js');
var telemetry = require('./telemetry.js');
var webhooks = require('./webhooks.js');

const providers = [
    registries,
    admin,
    coreStore,
    webhooks,
    telemetry,
    cron
];

exports.providers = providers;
//# sourceMappingURL=index.js.map
