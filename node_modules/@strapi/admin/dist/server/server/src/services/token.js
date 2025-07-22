'use strict';

var crypto = require('crypto');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

const defaultJwtOptions = {
    expiresIn: '30d'
};
const getTokenOptions = ()=>{
    const { options, secret } = strapi.config.get('admin.auth', {});
    return {
        secret,
        options: _.merge(defaultJwtOptions, options)
    };
};
/**
 * Create a random token
 */ const createToken = ()=>{
    return crypto.randomBytes(20).toString('hex');
};
/**
 * Creates a JWT token for an administration user
 * @param user - admin user
 */ const createJwtToken = (user)=>{
    const { options, secret } = getTokenOptions();
    return jwt.sign({
        id: user.id
    }, secret, options);
};
/**
 * Tries to decode a token an return its payload and if it is valid
 * @param token - a token to decode
 * @return decodeInfo - the decoded info
 */ const decodeJwtToken = (token)=>{
    const { secret } = getTokenOptions();
    try {
        const payload = jwt.verify(token, secret);
        return {
            payload,
            isValid: true
        };
    } catch (err) {
        return {
            payload: null,
            isValid: false
        };
    }
};
const checkSecretIsDefined = ()=>{
    if (strapi.config.get('admin.serveAdminPanel') && !strapi.config.get('admin.auth.secret')) {
        throw new Error(`Missing auth.secret. Please set auth.secret in config/admin.js (ex: you can generate one using Node with \`crypto.randomBytes(16).toString('base64')\`).
For security reasons, prefer storing the secret in an environment variable and read it in config/admin.js. See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`);
    }
};

exports.checkSecretIsDefined = checkSecretIsDefined;
exports.createJwtToken = createJwtToken;
exports.createToken = createToken;
exports.decodeJwtToken = decodeJwtToken;
exports.getTokenOptions = getTokenOptions;
//# sourceMappingURL=token.js.map
