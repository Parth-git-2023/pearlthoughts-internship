import { traverseEntity, async } from '@strapi/utils';
import { getService } from '../../utils/index.mjs';

function isFile(value, attribute) {
    if (!value || attribute.type !== 'media') {
        return false;
    }
    return true;
}
/**
 * Visitor function to sign media URLs
 */ const signEntityMediaVisitor = async ({ key, value, attribute }, { set })=>{
    const { signFileUrls } = getService('file');
    if (!attribute) {
        return;
    }
    if (attribute.type !== 'media') {
        return;
    }
    if (isFile(value, attribute)) {
        // If the attribute is repeatable sign each file
        if (attribute.multiple) {
            const signedFiles = await async.map(value, signFileUrls);
            set(key, signedFiles);
            return;
        }
        // If the attribute is not repeatable only sign a single file
        const signedFile = await signFileUrls(value);
        set(key, signedFile);
    }
};
/**
 *
 * Iterate through an entity manager result
 * Check which modelAttributes are media and pre sign the image URLs
 * if they are from the current upload provider
 *
 * @param {Object} entity
 * @param {Object} modelAttributes
 * @returns
 */ const signEntityMedia = async (entity, uid)=>{
    const model = strapi.getModel(uid);
    return traverseEntity(// @ts-expect-error - FIXME: fix traverseEntity using wrong types
    signEntityMediaVisitor, {
        schema: model,
        getModel: strapi.getModel.bind(strapi)
    }, entity);
};

export { signEntityMedia };
//# sourceMappingURL=utils.mjs.map
