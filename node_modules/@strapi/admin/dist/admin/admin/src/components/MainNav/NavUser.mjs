import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { Menu, Flex, Typography, Avatar, VisuallyHidden, Badge } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useAuth } from '../../features/Auth.mjs';

const MenuTrigger = styled(Menu.Trigger)`
  height: ${({ theme })=>theme.spaces[7]};
  width: ${({ theme })=>theme.spaces[7]};
  border: none;
  border-radius: 50%;
  padding: 0;
  overflow: hidden;
`;
const MenuContent = styled(Menu.Content)`
  max-height: fit-content;
  width: 200px;
`;
const UserInfo = styled(Flex)`
  && {
    padding: ${({ theme })=>theme.spaces[3]};
  }
  align-items: flex-start;
`;
const BadgeWrapper = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme })=>theme.spaces[1]};

  width: 100%;
`;
const StyledTypography = styled(Typography)`
  word-break: break-word;
  margin-bottom: ${({ theme })=>theme.spaces[3]};
`;
const NavUser = ({ children, initials, ...props })=>{
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const user = useAuth('User', (state)=>state.user);
    const logout = useAuth('Logout', (state)=>state.logout);
    const handleProfile = ()=>{
        navigate('/me');
    };
    const handleLogout = ()=>{
        logout();
        navigate('/auth/login');
    };
    return /*#__PURE__*/ jsx(Flex, {
        justifyContent: "center",
        padding: 3,
        borderStyle: "solid",
        borderWidth: "1px 0 0 0",
        borderColor: "neutral150",
        ...props,
        children: /*#__PURE__*/ jsxs(Menu.Root, {
            children: [
                /*#__PURE__*/ jsxs(MenuTrigger, {
                    endIcon: null,
                    fullWidth: true,
                    justifyContent: "center",
                    children: [
                        /*#__PURE__*/ jsx(Avatar.Item, {
                            delayMs: 0,
                            fallback: initials
                        }),
                        /*#__PURE__*/ jsx(VisuallyHidden, {
                            tag: "span",
                            children: children
                        })
                    ]
                }),
                /*#__PURE__*/ jsxs(MenuContent, {
                    popoverPlacement: "top-start",
                    zIndex: 3,
                    children: [
                        /*#__PURE__*/ jsxs(UserInfo, {
                            direction: "column",
                            gap: 0,
                            alignItems: "flex-start",
                            children: [
                                /*#__PURE__*/ jsx(Typography, {
                                    variant: "omega",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    children: children
                                }),
                                /*#__PURE__*/ jsx(StyledTypography, {
                                    variant: "pi",
                                    textColor: "neutral600",
                                    children: user?.email
                                }),
                                /*#__PURE__*/ jsx(BadgeWrapper, {
                                    children: user?.roles?.map((role)=>/*#__PURE__*/ jsx(Badge, {
                                            children: role.name
                                        }, role.id))
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsx(Menu.Separator, {}),
                        /*#__PURE__*/ jsx(Menu.Item, {
                            onSelect: handleProfile,
                            children: formatMessage({
                                id: 'global.profile.settings',
                                defaultMessage: 'Profile settings'
                            })
                        }),
                        /*#__PURE__*/ jsx(Menu.Item, {
                            variant: "danger",
                            onSelect: handleLogout,
                            color: "danger600",
                            children: formatMessage({
                                id: 'app.components.LeftMenu.logout',
                                defaultMessage: 'Log out'
                            })
                        })
                    ]
                })
            ]
        })
    });
};

export { NavUser };
//# sourceMappingURL=NavUser.mjs.map
