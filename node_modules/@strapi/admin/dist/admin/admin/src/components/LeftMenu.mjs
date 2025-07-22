import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { Flex, useCollator, Divider } from '@strapi/design-system';
import { Lightning } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { useAuth } from '../features/Auth.mjs';
import { useTracking } from '../features/Tracking.mjs';
import { getInitials, getDisplayName } from '../utils/users.mjs';
import { MainNav } from './MainNav/MainNav.mjs';
import { NavBrand } from './MainNav/NavBrand.mjs';
import { NavLink } from './MainNav/NavLink.mjs';
import { NavUser } from './MainNav/NavUser.mjs';
import { TrialCountdown } from './MainNav/TrialCountdown.mjs';

const sortLinks = (links)=>{
    return links.sort((a, b)=>{
        // if no position is defined, we put the link in the position of the external plugins, before the plugins list
        const positionA = a.position ?? 6;
        const positionB = b.position ?? 6;
        if (positionA < positionB) {
            return -1;
        } else {
            return 1;
        }
    });
};
const NavLinkBadgeCounter = styled(NavLink.Badge)`
  span {
    color: ${({ theme })=>theme.colors.neutral0};
  }
`;
const NavLinkBadgeLock = styled(NavLink.Badge)`
  background-color: transparent;
`;
const NavListWrapper = styled(Flex)`
  overflow-y: auto;
`;
const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks })=>{
    const user = useAuth('AuthenticatedApp', (state)=>state.user);
    const { trackUsage } = useTracking();
    const { pathname } = useLocation();
    const userDisplayName = getDisplayName(user);
    const { formatMessage, locale } = useIntl();
    const formatter = useCollator(locale, {
        sensitivity: 'base'
    });
    const initials = getInitials(user);
    const handleClickOnLink = (destination)=>{
        trackUsage('willNavigate', {
            from: pathname,
            to: destination
        });
    };
    const listLinksAlphabeticallySorted = [
        ...pluginsSectionLinks,
        ...generalSectionLinks
    ].sort((a, b)=>formatter.compare(formatMessage(a.intlLabel), formatMessage(b.intlLabel)));
    const listLinks = sortLinks(listLinksAlphabeticallySorted);
    return /*#__PURE__*/ jsxs(MainNav, {
        children: [
            /*#__PURE__*/ jsx(NavBrand, {}),
            /*#__PURE__*/ jsx(Divider, {}),
            /*#__PURE__*/ jsx(NavListWrapper, {
                tag: "ul",
                gap: 3,
                direction: "column",
                flex: 1,
                paddingTop: 3,
                paddingBottom: 3,
                children: listLinks.length > 0 ? listLinks.map((link)=>{
                    const LinkIcon = link.icon;
                    const badgeContentLock = link?.licenseOnly ? /*#__PURE__*/ jsx(Lightning, {
                        fill: "primary600"
                    }) : undefined;
                    const badgeContentNumeric = link.notificationsCount && link.notificationsCount > 0 ? link.notificationsCount.toString() : undefined;
                    const labelValue = formatMessage(link.intlLabel);
                    return /*#__PURE__*/ jsx(Flex, {
                        tag: "li",
                        children: /*#__PURE__*/ jsx(NavLink.Tooltip, {
                            label: labelValue,
                            children: /*#__PURE__*/ jsxs(NavLink.Link, {
                                to: link.to,
                                onClick: ()=>handleClickOnLink(link.to),
                                "aria-label": labelValue,
                                children: [
                                    /*#__PURE__*/ jsx(NavLink.Icon, {
                                        label: labelValue,
                                        children: /*#__PURE__*/ jsx(LinkIcon, {
                                            width: "20",
                                            height: "20",
                                            fill: "neutral500"
                                        })
                                    }),
                                    badgeContentLock ? /*#__PURE__*/ jsx(NavLinkBadgeLock, {
                                        label: "locked",
                                        textColor: "neutral500",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        children: badgeContentLock
                                    }) : badgeContentNumeric ? /*#__PURE__*/ jsx(NavLinkBadgeCounter, {
                                        label: badgeContentNumeric,
                                        backgroundColor: "primary600",
                                        width: "2.3rem",
                                        color: "neutral0",
                                        children: badgeContentNumeric
                                    }) : null
                                ]
                            })
                        })
                    }, link.to);
                }) : null
            }),
            /*#__PURE__*/ jsx(TrialCountdown, {}),
            /*#__PURE__*/ jsx(NavUser, {
                initials: initials,
                children: userDisplayName
            })
        ]
    });
};

export { LeftMenu };
//# sourceMappingURL=LeftMenu.mjs.map
