'use strict';

var utils = require('@strapi/utils');

const renewToken = utils.yup.object().shape({
    token: utils.yup.string().required()
}).required().noUnknown();
var validateRenewTokenInput = utils.validateYupSchema(renewToken);

module.exports = validateRenewTokenInput;
//# sourceMappingURL=renew-token.js.map
