import constants from './constants.mjs';

const DEFAULT_ATTIBUTES = [
    'createdAt',
    'updatedAt',
    'publishedAt',
    'createdBy',
    'updatedBy',
    'locale',
    'localizations'
];
const createGuidedTourService = ({ strapi })=>{
    const getCompletedActions = async ()=>{
        // Check if any content-type schemas have been created on the api:: namespace
        const contentTypeSchemaNames = Object.keys(strapi.contentTypes).filter((contentTypeUid)=>contentTypeUid.startsWith('api::'));
        const contentTypeSchemaAttributes = contentTypeSchemaNames.map((uid)=>{
            const attributes = Object.keys(strapi.contentType(uid).attributes);
            return attributes.filter((attribute)=>!DEFAULT_ATTIBUTES.includes(attribute));
        });
        const didCreateContentTypeSchema = (()=>{
            if (contentTypeSchemaNames.length === 0) {
                return false;
            }
            return contentTypeSchemaAttributes.some((attributes)=>attributes.length > 0);
        })();
        // Check if any content has been created for content-types on the api:: namespace
        const hasContent = await (async ()=>{
            for (const name of contentTypeSchemaNames){
                const count = await strapi.documents(name).count({});
                if (count > 0) return true;
            }
            return false;
        })();
        const didCreateContent = didCreateContentTypeSchema && hasContent;
        // Check if any api tokens have been created besides the default ones
        const createdApiTokens = await strapi.documents('admin::api-token').findMany({
            fields: [
                'name',
                'description'
            ]
        });
        const didCreateApiToken = createdApiTokens.some((doc)=>constants.DEFAULT_API_TOKENS.every((token)=>token.name !== doc.name && token.description !== doc.description));
        // Compute an array of action names that have been completed
        const requiredActions = {
            didCreateContentTypeSchema,
            didCreateContent,
            didCreateApiToken
        };
        const requiredActionNames = Object.keys(requiredActions);
        const completedActions = requiredActionNames.filter((key)=>requiredActions[key]);
        return completedActions;
    };
    return {
        getCompletedActions
    };
};

export { createGuidedTourService };
//# sourceMappingURL=guided-tour.mjs.map
