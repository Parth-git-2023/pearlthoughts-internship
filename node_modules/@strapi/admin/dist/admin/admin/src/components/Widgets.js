'use strict';

var jsxRuntime = require('react/jsx-runtime');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');
var styled = require('styled-components');
var users = require('../utils/users.js');

/* -------------------------------------------------------------------------------------------------
 * ProfileWidget
 * -----------------------------------------------------------------------------------------------*/ const DisplayNameTypography = styled.styled(designSystem.Typography)`
  font-size: 2.4rem;
`;
const ProfileWidget = ()=>{
    const user = strapiAdmin.useAuth('User', (state)=>state.user);
    const userDisplayName = users.getDisplayName(user);
    const initials = users.getInitials(user);
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
        direction: "column",
        gap: 3,
        height: "100%",
        justifyContent: "center",
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Avatar.Item, {
                delayMs: 0,
                fallback: initials
            }),
            userDisplayName && /*#__PURE__*/ jsxRuntime.jsx(DisplayNameTypography, {
                fontWeight: "bold",
                textTransform: "none",
                textAlign: "center",
                children: userDisplayName
            }),
            user?.email && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                variant: "omega",
                textColor: "neutral600",
                children: user?.email
            }),
            user?.roles?.length && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                marginTop: 2,
                gap: 1,
                wrap: "wrap",
                children: user?.roles?.map((role)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Badge, {
                        children: role.name
                    }, role.id))
            })
        ]
    });
};

exports.ProfileWidget = ProfileWidget;
//# sourceMappingURL=Widgets.js.map
