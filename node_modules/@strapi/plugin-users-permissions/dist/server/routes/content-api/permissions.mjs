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

export { requirePermissions as __require };
//# sourceMappingURL=permissions.mjs.map
