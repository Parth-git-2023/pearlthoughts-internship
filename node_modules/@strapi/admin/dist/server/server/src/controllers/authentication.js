'use strict';

var passport = require('koa-passport');
var compose = require('koa-compose');
require('@strapi/types');
var utils = require('@strapi/utils');
var index = require('../utils/index.js');
var register = require('../validation/authentication/register.js');
var forgotPassword = require('../validation/authentication/forgot-password.js');
var resetPassword = require('../validation/authentication/reset-password.js');
var renewToken = require('../validation/authentication/renew-token.js');

const { ApplicationError, ValidationError } = utils.errors;
var authentication = {
    login: compose([
        (ctx, next)=>{
            return passport.authenticate('local', {
                session: false
            }, (err, user, info)=>{
                if (err) {
                    strapi.eventHub.emit('admin.auth.error', {
                        error: err,
                        provider: 'local'
                    });
                    // if this is a recognized error, allow it to bubble up to user
                    if (err.details?.code === 'LOGIN_NOT_ALLOWED') {
                        throw err;
                    }
                    // for all other errors throw a generic error to prevent leaking info
                    return ctx.notImplemented();
                }
                if (!user) {
                    strapi.eventHub.emit('admin.auth.error', {
                        error: new Error(info.message),
                        provider: 'local'
                    });
                    throw new ApplicationError(info.message);
                }
                const query = ctx.state;
                query.user = user;
                const sanitizedUser = index.getService('user').sanitizeUser(user);
                strapi.eventHub.emit('admin.auth.success', {
                    user: sanitizedUser,
                    provider: 'local'
                });
                return next();
            })(ctx, next);
        },
        (ctx)=>{
            const { user } = ctx.state;
            ctx.body = {
                data: {
                    token: index.getService('token').createJwtToken(user),
                    user: index.getService('user').sanitizeUser(ctx.state.user)
                }
            };
        }
    ]),
    async renewToken (ctx) {
        await renewToken(ctx.request.body);
        const { token } = ctx.request.body;
        const { isValid, payload } = index.getService('token').decodeJwtToken(token);
        if (!isValid) {
            throw new ValidationError('Invalid token');
        }
        ctx.body = {
            data: {
                token: index.getService('token').createJwtToken({
                    id: payload.id
                })
            }
        };
    },
    async registrationInfo (ctx) {
        await register.validateRegistrationInfoQuery(ctx.request.query);
        const { registrationToken } = ctx.request.query;
        const registrationInfo = await index.getService('user').findRegistrationInfo(registrationToken);
        if (!registrationInfo) {
            throw new ValidationError('Invalid registrationToken');
        }
        ctx.body = {
            data: registrationInfo
        };
    },
    async register (ctx) {
        const input = ctx.request.body;
        await register.validateRegistrationInput(input);
        const user = await index.getService('user').register(input);
        ctx.body = {
            data: {
                token: index.getService('token').createJwtToken(user),
                user: index.getService('user').sanitizeUser(user)
            }
        };
    },
    async registerAdmin (ctx) {
        const input = ctx.request.body;
        await register.validateAdminRegistrationInput(input);
        const hasAdmin = await index.getService('user').exists();
        if (hasAdmin) {
            throw new ApplicationError('You cannot register a new super admin');
        }
        const superAdminRole = await index.getService('role').getSuperAdmin();
        if (!superAdminRole) {
            throw new ApplicationError("Cannot register the first admin because the super admin role doesn't exist.");
        }
        const user = await index.getService('user').create({
            ...input,
            registrationToken: null,
            isActive: true,
            roles: superAdminRole ? [
                superAdminRole.id
            ] : []
        });
        strapi.telemetry.send('didCreateFirstAdmin');
        ctx.body = {
            data: {
                token: index.getService('token').createJwtToken(user),
                user: index.getService('user').sanitizeUser(user)
            }
        };
    },
    async forgotPassword (ctx) {
        const input = ctx.request.body;
        await forgotPassword(input);
        index.getService('auth').forgotPassword(input);
        ctx.status = 204;
    },
    async resetPassword (ctx) {
        const input = ctx.request.body;
        await resetPassword(input);
        const user = await index.getService('auth').resetPassword(input);
        ctx.body = {
            data: {
                token: index.getService('token').createJwtToken(user),
                user: index.getService('user').sanitizeUser(user)
            }
        };
    },
    logout (ctx) {
        const sanitizedUser = index.getService('user').sanitizeUser(ctx.state.user);
        strapi.eventHub.emit('admin.logout', {
            user: sanitizedUser
        });
        ctx.body = {
            data: {}
        };
    }
};

module.exports = authentication;
//# sourceMappingURL=authentication.js.map
