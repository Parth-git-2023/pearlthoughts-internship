import _ from 'lodash';
import { errors, async } from '@strapi/utils';
import { getService } from '../utils/index.mjs';
import { ACTIONS, FILE_MODEL_UID } from '../constants.mjs';
import { validateUploadBody } from './validation/admin/upload.mjs';
import { findEntityAndCheckPermissions } from './utils/find-entity-and-check-permissions.mjs';

var adminUpload = {
    async updateFileInfo (ctx) {
        const { state: { userAbility, user }, query: { id }, request: { body } } = ctx;
        if (typeof id !== 'string') {
            throw new errors.ValidationError('File id is required');
        }
        const uploadService = getService('upload');
        const { pm } = await findEntityAndCheckPermissions(userAbility, ACTIONS.update, FILE_MODEL_UID, id);
        const data = await validateUploadBody(body);
        const file = await uploadService.updateFileInfo(id, data.fileInfo, {
            user
        });
        ctx.body = await pm.sanitizeOutput(file, {
            action: ACTIONS.read
        });
    },
    async replaceFile (ctx) {
        const { state: { userAbility, user }, query: { id }, request: { body, files: { files } = {} } } = ctx;
        if (typeof id !== 'string') {
            throw new errors.ValidationError('File id is required');
        }
        const uploadService = getService('upload');
        const { pm } = await findEntityAndCheckPermissions(userAbility, ACTIONS.update, FILE_MODEL_UID, id);
        if (Array.isArray(files)) {
            throw new errors.ApplicationError('Cannot replace a file with multiple ones');
        }
        const data = await validateUploadBody(body);
        const replacedFile = await uploadService.replace(id, {
            data,
            file: files
        }, {
            user
        });
        // Sign file urls for private providers
        const signedFile = await getService('file').signFileUrls(replacedFile);
        ctx.body = await pm.sanitizeOutput(signedFile, {
            action: ACTIONS.read
        });
    },
    async uploadFiles (ctx) {
        const { state: { userAbility, user }, request: { body, files: { files } = {} } } = ctx;
        const uploadService = getService('upload');
        const pm = strapi.service('admin::permission').createPermissionsManager({
            ability: userAbility,
            action: ACTIONS.create,
            model: FILE_MODEL_UID
        });
        if (!pm.isAllowed) {
            return ctx.forbidden();
        }
        const data = await validateUploadBody(body);
        const uploadedFiles = await uploadService.upload({
            data,
            files
        }, {
            user
        });
        // Sign file urls for private providers
        const signedFiles = await async.map(uploadedFiles, getService('file').signFileUrls);
        ctx.body = await pm.sanitizeOutput(signedFiles, {
            action: ACTIONS.read
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
            throw new errors.ApplicationError('Files are empty');
        }
        await (id ? this.replaceFile : this.uploadFiles)(ctx);
    }
};

export { adminUpload as default };
//# sourceMappingURL=admin-upload.mjs.map
