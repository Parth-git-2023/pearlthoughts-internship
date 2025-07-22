'use strict';

var fp = require('lodash/fp');
var utils = require('@strapi/utils');
var index = require('./utils/index.js');
var adminActions = require('./config/admin-actions.js');
var adminConditions = require('./config/admin-conditions.js');
var constants = require('./services/constants.js');

const defaultAdminAuthSettings = {
    providers: {
        autoRegister: false,
        defaultRole: null,
        ssoLockedRoles: null
    }
};
const registerPermissionActions = async ()=>{
    await index.getService('permission').actionProvider.registerMany(adminActions.default.actions);
};
const registerAdminConditions = async ()=>{
    await index.getService('permission').conditionProvider.registerMany(adminConditions.default.conditions);
};
const registerModelHooks = ()=>{
    const { sendDidChangeInterfaceLanguage } = index.getService('metrics');
    strapi.db.lifecycles.subscribe({
        models: [
            'admin::user'
        ],
        afterCreate: sendDidChangeInterfaceLanguage,
        afterDelete: sendDidChangeInterfaceLanguage,
        afterUpdate ({ params }) {
            if (params.data.preferedLanguage) {
                sendDidChangeInterfaceLanguage();
            }
        }
    });
};
const syncAuthSettings = async ()=>{
    const adminStore = await strapi.store({
        type: 'core',
        name: 'admin'
    });
    const adminAuthSettings = await adminStore.get({
        key: 'auth'
    });
    const newAuthSettings = fp.merge(defaultAdminAuthSettings, adminAuthSettings);
    const roleExists = await index.getService('role').exists({
        id: newAuthSettings.providers.defaultRole
    });
    // Reset the default SSO role if it has been deleted manually
    if (!roleExists) {
        newAuthSettings.providers.defaultRole = null;
    }
    await adminStore.set({
        key: 'auth',
        value: newAuthSettings
    });
};
const syncAPITokensPermissions = async ()=>{
    const validPermissions = strapi.contentAPI.permissions.providers.action.keys();
    const permissionsInDB = await utils.async.pipe(strapi.db.query('admin::api-token-permission').findMany, fp.map('action'))();
    const unknownPermissions = fp.uniq(fp.difference(permissionsInDB, validPermissions));
    if (unknownPermissions.length > 0) {
        await strapi.db.query('admin::api-token-permission').deleteMany({
            where: {
                action: {
                    $in: unknownPermissions
                }
            }
        });
    }
};
/**
 * Ensures the creation of default API tokens during the app creation.
 *
 * Checks the database for existing users and API tokens:
 * - If there are no users and no API tokens, it creates two default API tokens:
 *   1. A "Read Only" API token with permissions for accessing resources.
 *   2. A "Full Access" API token with permissions for accessing and modifying resources.
 *
 * @sideEffects Creates new API tokens in the database if conditions are met.
 */ const createDefaultAPITokensIfNeeded = async ()=>{
    const userService = index.getService('user');
    const apiTokenService = index.getService('api-token');
    const usersCount = await userService.count();
    const apiTokenCount = await apiTokenService.count();
    if (usersCount === 0 && apiTokenCount === 0) {
        for (const token of constants.DEFAULT_API_TOKENS){
            await apiTokenService.create(token);
        }
    }
};
var bootstrap = (async ({ strapi: strapi1 })=>{
    await registerAdminConditions();
    await registerPermissionActions();
    registerModelHooks();
    const permissionService = index.getService('permission');
    const userService = index.getService('user');
    const roleService = index.getService('role');
    const apiTokenService = index.getService('api-token');
    const transferService = index.getService('transfer');
    const tokenService = index.getService('token');
    await roleService.createRolesIfNoneExist();
    await roleService.resetSuperAdminPermissions();
    await roleService.displayWarningIfNoSuperAdmin();
    await permissionService.cleanPermissionsInDatabase();
    await userService.displayWarningIfUsersDontHaveRole();
    await syncAuthSettings();
    await syncAPITokensPermissions();
    await index.getService('metrics').sendUpdateProjectInformation(strapi1);
    index.getService('metrics').startCron(strapi1);
    apiTokenService.checkSaltIsDefined();
    transferService.token.checkSaltIsDefined();
    tokenService.checkSecretIsDefined();
    await createDefaultAPITokensIfNeeded();
});

module.exports = bootstrap;
//# sourceMappingURL=bootstrap.js.map
