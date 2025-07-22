'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var Auth = require('../features/Auth.js');
var Tracking = require('../features/Tracking.js');
var users = require('../utils/users.js');
var MainNav = require('./MainNav/MainNav.js');
var NavBrand = require('./MainNav/NavBrand.js');
var NavLink = require('./MainNav/NavLink.js');
var NavUser = require('./MainNav/NavUser.js');
var TrialCountdown = require('./MainNav/TrialCountdown.js');

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
const NavLinkBadgeCounter = styled.styled(NavLink.NavLink.Badge)`
  span {
    color: ${({ theme })=>theme.colors.neutral0};
  }
`;
const NavLinkBadgeLock = styled.styled(NavLink.NavLink.Badge)`
  background-color: transparent;
`;
const NavListWrapper = styled.styled(designSystem.Flex)`
  overflow-y: auto;
`;
const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks })=>{
    const user = Auth.useAuth('AuthenticatedApp', (state)=>state.user);
    const { trackUsage } = Tracking.useTracking();
    const { pathname } = reactRouterDom.useLocation();
    const userDisplayName = users.getDisplayName(user);
    const { formatMessage, locale } = reactIntl.useIntl();
    const formatter = designSystem.useCollator(locale, {
        sensitivity: 'base'
    });
    const initials = users.getInitials(user);
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
    return /*#__PURE__*/ jsxRuntime.jsxs(MainNav.MainNav, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(NavBrand.NavBrand, {}),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Divider, {}),
            /*#__PURE__*/ jsxRuntime.jsx(NavListWrapper, {
                tag: "ul",
                gap: 3,
                direction: "column",
                flex: 1,
                paddingTop: 3,
                paddingBottom: 3,
                children: listLinks.length > 0 ? listLinks.map((link)=>{
                    const LinkIcon = link.icon;
                    const badgeContentLock = link?.licenseOnly ? /*#__PURE__*/ jsxRuntime.jsx(icons.Lightning, {
                        fill: "primary600"
                    }) : undefined;
                    const badgeContentNumeric = link.notificationsCount && link.notificationsCount > 0 ? link.notificationsCount.toString() : undefined;
                    const labelValue = formatMessage(link.intlLabel);
                    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        tag: "li",
                        children: /*#__PURE__*/ jsxRuntime.jsx(NavLink.NavLink.Tooltip, {
                            label: labelValue,
                            children: /*#__PURE__*/ jsxRuntime.jsxs(NavLink.NavLink.Link, {
                                to: link.to,
                                onClick: ()=>handleClickOnLink(link.to),
                                "aria-label": labelValue,
                                children: [
                                    /*#__PURE__*/ jsxRuntime.jsx(NavLink.NavLink.Icon, {
                                        label: labelValue,
                                        children: /*#__PURE__*/ jsxRuntime.jsx(LinkIcon, {
                                            width: "20",
                                            height: "20",
                                            fill: "neutral500"
                                        })
                                    }),
                                    badgeContentLock ? /*#__PURE__*/ jsxRuntime.jsx(NavLinkBadgeLock, {
                                        label: "locked",
                                        textColor: "neutral500",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        children: badgeContentLock
                                    }) : badgeContentNumeric ? /*#__PURE__*/ jsxRuntime.jsx(NavLinkBadgeCounter, {
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
            /*#__PURE__*/ jsxRuntime.jsx(TrialCountdown.TrialCountdown, {}),
            /*#__PURE__*/ jsxRuntime.jsx(NavUser.NavUser, {
                initials: initials,
                children: userDisplayName
            })
        ]
    });
};

exports.LeftMenu = LeftMenu;
//# sourceMappingURL=LeftMenu.js.map
