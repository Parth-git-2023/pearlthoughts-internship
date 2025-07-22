'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var SubNav = require('../../../components/SubNav.js');
var Tracking = require('../../../features/Tracking.js');

const StyledBadge = styled.styled(designSystem.Badge)`
  border-radius: 50%;
  padding: ${({ theme })=>theme.spaces[2]};
  height: 2rem;
`;
const SettingsNav = ({ menu })=>{
    const { formatMessage } = reactIntl.useIntl();
    const { trackUsage } = Tracking.useTracking();
    const { pathname } = reactRouterDom.useLocation();
    const filteredMenu = menu.filter((section)=>!section.links.every((link)=>link.isDisplayed === false));
    const sections = filteredMenu.map((section)=>{
        return {
            ...section,
            title: section.intlLabel,
            links: section.links.map((link)=>{
                return {
                    ...link,
                    title: link.intlLabel,
                    name: link.id
                };
            })
        };
    });
    const label = formatMessage({
        id: 'global.settings',
        defaultMessage: 'Settings'
    });
    const handleClickOnLink = (destination)=>()=>{
            trackUsage('willNavigate', {
                from: pathname,
                to: destination
            });
        };
    return /*#__PURE__*/ jsxRuntime.jsxs(SubNav.SubNav.Main, {
        "aria-label": label,
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(SubNav.SubNav.Header, {
                label: label
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Divider, {
                background: "neutral150",
                marginBottom: 5
            }),
            /*#__PURE__*/ jsxRuntime.jsx(SubNav.SubNav.Sections, {
                children: sections.map((section)=>/*#__PURE__*/ jsxRuntime.jsx(SubNav.SubNav.Section, {
                        label: formatMessage(section.intlLabel),
                        children: section.links.map((link)=>{
                            return /*#__PURE__*/ jsxRuntime.jsx(SubNav.SubNav.Link, {
                                to: link.to,
                                onClick: handleClickOnLink(link.to),
                                label: formatMessage(link.intlLabel),
                                endAction: /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                                    children: [
                                        link?.licenseOnly && /*#__PURE__*/ jsxRuntime.jsx(icons.Lightning, {
                                            fill: "primary600",
                                            width: "1.5rem",
                                            height: "1.5rem"
                                        }),
                                        link?.hasNotification && /*#__PURE__*/ jsxRuntime.jsx(StyledBadge, {
                                            "aria-label": "Notification",
                                            backgroundColor: "primary600",
                                            textColor: "neutral0",
                                            children: "1"
                                        })
                                    ]
                                })
                            }, link.id);
                        })
                    }, section.id))
            })
        ]
    });
};

exports.SettingsNav = SettingsNav;
//# sourceMappingURL=SettingsNav.js.map
