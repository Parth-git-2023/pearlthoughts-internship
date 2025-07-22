import { yup, validateYupSchema } from '@strapi/utils';

const renewToken = yup.object().shape({
    token: yup.string().required()
}).required().noUnknown();
var validateRenewTokenInput = validateYupSchema(renewToken);

export { validateRenewTokenInput as default };
//# sourceMappingURL=renew-token.mjs.map
