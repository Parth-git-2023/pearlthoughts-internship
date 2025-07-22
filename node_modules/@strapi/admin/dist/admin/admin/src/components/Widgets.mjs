import { jsxs, jsx } from 'react/jsx-runtime';
import { useAuth } from '@strapi/admin/strapi-admin';
import { Typography, Flex, Avatar, Badge } from '@strapi/design-system';
import { styled } from 'styled-components';
import { getInitials, getDisplayName } from '../utils/users.mjs';

/* -------------------------------------------------------------------------------------------------
 * ProfileWidget
 * -----------------------------------------------------------------------------------------------*/ const DisplayNameTypography = styled(Typography)`
  font-size: 2.4rem;
`;
const ProfileWidget = ()=>{
    const user = useAuth('User', (state)=>state.user);
    const userDisplayName = getDisplayName(user);
    const initials = getInitials(user);
    return /*#__PURE__*/ jsxs(Flex, {
        direction: "column",
        gap: 3,
        height: "100%",
        justifyContent: "center",
        children: [
            /*#__PURE__*/ jsx(Avatar.Item, {
                delayMs: 0,
                fallback: initials
            }),
            userDisplayName && /*#__PURE__*/ jsx(DisplayNameTypography, {
                fontWeight: "bold",
                textTransform: "none",
                textAlign: "center",
                children: userDisplayName
            }),
            user?.email && /*#__PURE__*/ jsx(Typography, {
                variant: "omega",
                textColor: "neutral600",
                children: user?.email
            }),
            user?.roles?.length && /*#__PURE__*/ jsx(Flex, {
                marginTop: 2,
                gap: 1,
                wrap: "wrap",
                children: user?.roles?.map((role)=>/*#__PURE__*/ jsx(Badge, {
                        children: role.name
                    }, role.id))
            })
        ]
    });
};

export { ProfileWidget };
//# sourceMappingURL=Widgets.mjs.map
