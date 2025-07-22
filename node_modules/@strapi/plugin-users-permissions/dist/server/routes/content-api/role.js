'use strict';

var role;
var hasRequiredRole;
function requireRole() {
    if (hasRequiredRole) return role;
    hasRequiredRole = 1;
    role = [
        {
            method: 'GET',
            path: '/roles/:id',
            handler: 'role.findOne'
        },
        {
            method: 'GET',
            path: '/roles',
            handler: 'role.find'
        },
        {
            method: 'POST',
            path: '/roles',
            handler: 'role.createRole'
        },
        {
            method: 'PUT',
            path: '/roles/:role',
            handler: 'role.updateRole'
        },
        {
            method: 'DELETE',
            path: '/roles/:role',
            handler: 'role.deleteRole'
        }
    ];
    return role;
}

exports.__require = requireRole;
//# sourceMappingURL=role.js.map
