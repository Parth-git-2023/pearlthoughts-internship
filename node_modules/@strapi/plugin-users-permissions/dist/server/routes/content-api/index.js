'use strict';

var auth = require('./auth.js');
var user = require('./user.js');
var role = require('./role.js');
var permissions = require('./permissions.js');

var contentApi;
var hasRequiredContentApi;
function requireContentApi() {
    if (hasRequiredContentApi) return contentApi;
    hasRequiredContentApi = 1;
    const authRoutes = auth.__require();
    const userRoutes = user.__require();
    const roleRoutes = role.__require();
    const permissionsRoutes = permissions.__require();
    contentApi = {
        type: 'content-api',
        routes: [
            ...authRoutes,
            ...userRoutes,
            ...roleRoutes,
            ...permissionsRoutes
        ]
    };
    return contentApi;
}

exports.__require = requireContentApi;
//# sourceMappingURL=index.js.map
