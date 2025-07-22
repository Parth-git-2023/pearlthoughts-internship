'use strict';

var permissions;
var hasRequiredPermissions;
function requirePermissions() {
    if (hasRequiredPermissions) return permissions;
    hasRequiredPermissions = 1;
    permissions = [
        {
            method: 'GET',
            path: '/permissions',
            handler: 'permissions.getPermissions'
        }
    ];
    return permissions;
}

exports.__require = requirePermissions;
//# sourceMappingURL=permissions.js.map
