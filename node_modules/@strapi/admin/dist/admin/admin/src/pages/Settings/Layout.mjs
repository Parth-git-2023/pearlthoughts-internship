import { jsx, jsxs } from 'react/jsx-runtime';
import { useIntl } from 'react-intl';
import { useMatch, Navigate, Outlet } from 'react-router-dom';
import { Layouts } from '../../components/Layouts/Layout.mjs';
import { Page } from '../../components/PageHelpers.mjs';
import { useSettingsMenu } from '../../hooks/useSettingsMenu.mjs';
import { SettingsNav } from './components/SettingsNav.mjs';

const Layout = ()=>{
    /**
   * This ensures we're capturing the settingId from the URL
   * but also lets any nesting after that pass.
   */ const match = useMatch('/settings/:settingId/*');
    const { formatMessage } = useIntl();
    const { isLoading, menu } = useSettingsMenu();
    // Since the useSettingsMenu hook can make API calls in order to check the links permissions
    // We need to add a loading state to prevent redirecting the user while permissions are being checked
    if (isLoading) {
        return /*#__PURE__*/ jsx(Page.Loading, {});
    }
    if (!match?.params.settingId) {
        return /*#__PURE__*/ jsx(Navigate, {
            to: "application-infos"
        });
    }
    return /*#__PURE__*/ jsxs(Layouts.Root, {
        sideNav: /*#__PURE__*/ jsx(SettingsNav, {
            menu: menu
        }),
        children: [
            /*#__PURE__*/ jsx(Page.Title, {
                children: formatMessage({
                    id: 'global.settings',
                    defaultMessage: 'Settings'
                })
            }),
            /*#__PURE__*/ jsx(Outlet, {})
        ]
    });
};

export { Layout };
//# sourceMappingURL=Layout.mjs.map
