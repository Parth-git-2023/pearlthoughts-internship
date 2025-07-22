import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Badge, Divider } from '@strapi/design-system';
import { Lightning } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { SubNav } from '../../../components/SubNav.mjs';
import { useTracking } from '../../../features/Tracking.mjs';

const StyledBadge = styled(Badge)`
  border-radius: 50%;
  padding: ${({ theme })=>theme.spaces[2]};
  height: 2rem;
`;
const SettingsNav = ({ menu })=>{
    const { formatMessage } = useIntl();
    const { trackUsage } = useTracking();
    const { pathname } = useLocation();
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
    return /*#__PURE__*/ jsxs(SubNav.Main, {
        "aria-label": label,
        children: [
            /*#__PURE__*/ jsx(SubNav.Header, {
                label: label
            }),
            /*#__PURE__*/ jsx(Divider, {
                background: "neutral150",
                marginBottom: 5
            }),
            /*#__PURE__*/ jsx(SubNav.Sections, {
                children: sections.map((section)=>/*#__PURE__*/ jsx(SubNav.Section, {
                        label: formatMessage(section.intlLabel),
                        children: section.links.map((link)=>{
                            return /*#__PURE__*/ jsx(SubNav.Link, {
                                to: link.to,
                                onClick: handleClickOnLink(link.to),
                                label: formatMessage(link.intlLabel),
                                endAction: /*#__PURE__*/ jsxs(Fragment, {
                                    children: [
                                        link?.licenseOnly && /*#__PURE__*/ jsx(Lightning, {
                                            fill: "primary600",
                                            width: "1.5rem",
                                            height: "1.5rem"
                                        }),
                                        link?.hasNotification && /*#__PURE__*/ jsx(StyledBadge, {
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

export { SettingsNav };
//# sourceMappingURL=SettingsNav.mjs.map
