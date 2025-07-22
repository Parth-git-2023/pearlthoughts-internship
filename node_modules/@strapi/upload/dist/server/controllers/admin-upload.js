'use strict';

var _ = require('lodash');
var utils = require('@strapi/utils');
var index = require('../utils/index.js');
var constants = require('../constants.js');
var upload = require('./validation/admin/upload.js');
var findEntityAndCheckPermissions = require('./utils/find-entity-and-check-permissions.js');

var adminUpload = {
    async updateFileInfo (ctx) {
        const { state: { userAbility, user }, query: { id }, request: { body } } = ctx;
        if (typeof id !== 'string') {
            throw new utils.errors.ValidationError('File id is required');
        }
        const uploadService = index.getService('upload');
        const { pm } = await findEntityAndCheckPermissions.findEntityAndCheckPermissions(userAbility, constants.ACTIONS.update, constants.FILE_MODEL_UID, id);
        const data = await upload.validateUploadBody(body);
        const file = await uploadService.updateFileInfo(id, data.fileInfo, {
            user
        });
        ctx.body = await pm.sanitizeOutput(file, {
            action: constants.ACTIONS.read
        });
    },
    async replaceFile (ctx) {
        const { state: { userAbility, user }, query: { id }, request: { body, files: { files } = {} } } = ctx;
        if (typeof id !== 'string') {
            throw new utils.errors.ValidationError('File id is required');
        }
        const uploadService = index.getService('upload');
        const { pm } = await findEntityAndCheckPermissions.findEntityAndCheckPermissions(userAbility, constants.ACTIONS.update, constants.FILE_MODEL_UID, id);
        if (Array.isArray(files)) {
            throw new utils.errors.ApplicationError('Cannot replace a file with multiple ones');
        }
        const data = await upload.validateUploadBody(body);
        const replacedFile = await uploadService.replace(id, {
            data,
            file: files
        }, {
            user
        });
        // Sign file urls for private providers
        const signedFile = await index.getService('file').signFileUrls(replacedFile);
        ctx.body = await pm.sanitizeOutput(signedFile, {
            action: constants.ACTIONS.read
        });
    },
    async uploadFiles (ctx) {
        const { state: { userAbility, user }, request: { body, files: { files } = {} } } = ctx;
        const uploadService = index.getService('upload');
        const pm = strapi.service('admin::permission').createPermissionsManager({
            ability: userAbility,
            action: constants.ACTIONS.create,
            model: constants.FILE_MODEL_UID
        });
        if (!pm.isAllowed) {
            return ctx.forbidden();
        }
        const data = await upload.validateUploadBody(body);
        const uploadedFiles = await uploadService.upload({
            data,
            files
        }, {
            user
        });
        // Sign file urls for private providers
        const signedFiles = await utils.async.map(uploadedFiles, index.getService('file').signFileUrls);
        ctx.body = await pm.sanitizeOutput(signedFiles, {
            action: constants.ACTIONS.read
        });
        ctx.status = 201;
    },
    // TODO: split into multiple endpoints
    async upload (ctx) {
        const { query: { id }, request: { files: { files } = {} } } = ctx;
        if (_.isEmpty(files) || !Array.isArray(files) && files.size === 0) {
            if (id) {
                return this.updateFileInfo(ctx);
            }
            throw new utils.errors.ApplicationError('Files are empty');
        }
        await (id ? this.replaceFile : this.uploadFiles)(ctx);
    }
};

module.exports = adminUpload;
//# sourceMappingURL=admin-upload.js.map
