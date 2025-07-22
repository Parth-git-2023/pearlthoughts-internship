'use strict';

var register = require('./register.js');
var bootstrap = require('./bootstrap.js');
var destroy = require('./destroy.js');
var index = require('./content-types/index.js');
var index$1 = require('./services/index.js');
var index$2 = require('./controllers/index.js');
var index$3 = require('./routes/index.js');
var auditLogs$1 = require('./audit-logs/routes/audit-logs.js');
var auditLogs = require('./audit-logs/controllers/audit-logs.js');
var auditLogs$2 = require('./audit-logs/services/audit-logs.js');
var lifecycles = require('./audit-logs/services/lifecycles.js');
var auditLog = require('./audit-logs/content-types/audit-log.js');

const getAdminEE = ()=>{
    const eeAdmin = {
        register,
        bootstrap,
        destroy,
        contentTypes: {
            // Always register the audit-log content type to prevent data loss
            'audit-log': auditLog.auditLog,
            ...index
        },
        services: index$1,
        controllers: index$2,
        routes: index$3
    };
    // Only add the other audit-logs APIs if the feature is enabled by the user and the license
    if (strapi.config.get('admin.auditLogs.enabled', true) && strapi.ee.features.isEnabled('audit-logs')) {
        return {
            ...eeAdmin,
            controllers: {
                ...eeAdmin.controllers,
                'audit-logs': auditLogs
            },
            routes: {
                ...eeAdmin.routes,
                'audit-logs': auditLogs$1
            },
            async register ({ strapi: strapi1 }) {
                // Run the the default registration
                await eeAdmin.register({
                    strapi: strapi1
                });
                // Register an internal audit logs service
                strapi1.add('audit-logs', auditLogs$2.createAuditLogsService(strapi1));
                // Register an internal audit logs lifecycle service
                const auditLogsLifecycle = lifecycles.createAuditLogsLifecycleService(strapi1);
                strapi1.add('audit-logs-lifecycle', auditLogsLifecycle);
                await auditLogsLifecycle.register();
            },
            async destroy ({ strapi: strapi1 }) {
                strapi1.get('audit-logs-lifecycle').destroy();
                await eeAdmin.destroy({
                    strapi: strapi1
                });
            }
        };
    }
    return eeAdmin;
};

module.exports = getAdminEE;
//# sourceMappingURL=index.js.map
