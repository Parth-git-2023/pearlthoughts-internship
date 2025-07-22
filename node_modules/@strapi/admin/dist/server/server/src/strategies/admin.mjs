import { getService } from '../utils/index.mjs';

/** @type {import('.').AuthenticateFunction} */ const authenticate = async (ctx)=>{
    const { authorization } = ctx.request.header;
    if (!authorization) {
        return {
            authenticated: false
        };
    }
    const parts = authorization.split(/\s+/);
    if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return {
            authenticated: false
        };
    }
    const token = parts[1];
    const { payload, isValid } = getService('token').decodeJwtToken(token);
    if (!isValid) {
        return {
            authenticated: false
        };
    }
    const user = await strapi.db.query('admin::user').findOne({
        where: {
            id: payload.id
        },
        populate: [
            'roles'
        ]
    });
    if (!user || !(user.isActive === true)) {
        return {
            authenticated: false
        };
    }
    const userAbility = await getService('permission').engine.generateUserAbility(user);
    // TODO: use the ability from ctx.state.auth instead of
    // ctx.state.userAbility, and remove the assign below
    ctx.state.userAbility = userAbility;
    ctx.state.user = user;
    return {
        authenticated: true,
        credentials: user,
        ability: userAbility
    };
};
const name = 'admin';
/** @type {import('.').AuthStrategy} */ var adminAuthStrategy = {
    name,
    authenticate
};

export { authenticate, adminAuthStrategy as default, name };
//# sourceMappingURL=admin.mjs.map
