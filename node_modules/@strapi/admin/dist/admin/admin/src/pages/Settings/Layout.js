'use strict';

var jsxRuntime = require('react/jsx-runtime');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var Layout$1 = require('../../components/Layouts/Layout.js');
var PageHelpers = require('../../components/PageHelpers.js');
var useSettingsMenu = require('../../hooks/useSettingsMenu.js');
var SettingsNav = require('./components/SettingsNav.js');

const Layout = ()=>{
    /**
   * This ensures we're capturing the settingId from the URL
   * but also lets any nesting after that pass.
   */ const match = reactRouterDom.useMatch('/settings/:settingId/*');
    const { formatMessage } = reactIntl.useIntl();
    const { isLoading, menu } = useSettingsMenu.useSettingsMenu();
    // Since the useSettingsMenu hook can make API calls in order to check the links permissions
    // We need to add a loading state to prevent redirecting the user while permissions are being checked
    if (isLoading) {
        return /*#__PURE__*/ jsxRuntime.jsx(PageHelpers.Page.Loading, {});
    }
    if (!match?.params.settingId) {
        return /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Navigate, {
            to: "application-infos"
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsxs(Layout$1.Layouts.Root, {
        sideNav: /*#__PURE__*/ jsxRuntime.jsx(SettingsNav.SettingsNav, {
            menu: menu
        }),
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(PageHelpers.Page.Title, {
                children: formatMessage({
                    id: 'global.settings',
                    defaultMessage: 'Settings'
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Outlet, {})
        ]
    });
};

exports.Layout = Layout;
//# sourceMappingURL=Layout.js.map
