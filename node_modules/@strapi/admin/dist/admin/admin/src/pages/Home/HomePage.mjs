import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { Main, Flex, Grid, Typography, Box } from '@strapi/design-system';
import { PuzzlePiece } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layouts } from '../../components/Layouts/Layout.mjs';
import { Page } from '../../components/PageHelpers.mjs';
import { UnstableGuidedTourOverview } from '../../components/UnstableGuidedTour/Overview.mjs';
import { Widget } from '../../components/WidgetHelpers.mjs';
import '../../services/admin.mjs';
import { useEnterprise } from '../../hooks/useEnterprise.mjs';
import { useAuth } from '../../features/Auth.mjs';
import { useStrapiApp } from '../../features/StrapiApp.mjs';
import { FreeTrialEndedModal } from './components/FreeTrialEndedModal.mjs';
import { FreeTrialWelcomeModal } from './components/FreeTrialWelcomeModal.mjs';
import { GuidedTour } from './components/GuidedTour.mjs';

const WidgetRoot = ({ title, icon = PuzzlePiece, permissions = [], children, link })=>{
    const { formatMessage } = useIntl();
    const id = React.useId();
    const Icon = icon;
    const [permissionStatus, setPermissionStatus] = React.useState('loading');
    const checkUserHasPermissions = useAuth('WidgetRoot', (state)=>state.checkUserHasPermissions);
    React.useEffect(()=>{
        const checkPermissions = async ()=>{
            const matchingPermissions = await checkUserHasPermissions(permissions);
            const shouldGrant = matchingPermissions.length >= permissions.length;
            setPermissionStatus(shouldGrant ? 'granted' : 'forbidden');
        };
        if (!permissions || permissions.length === 0) {
            setPermissionStatus('granted');
        } else {
            checkPermissions();
        }
    }, [
        checkUserHasPermissions,
        permissions
    ]);
    return /*#__PURE__*/ jsxs(Flex, {
        width: "100%",
        hasRadius: true,
        direction: "column",
        alignItems: "flex-start",
        background: "neutral0",
        borderColor: "neutral150",
        shadow: "tableShadow",
        tag: "section",
        gap: 4,
        padding: 6,
        "aria-labelledby": id,
        children: [
            /*#__PURE__*/ jsxs(Flex, {
                direction: "row",
                gap: 2,
                justifyContent: "space-between",
                width: "100%",
                tag: "header",
                children: [
                    /*#__PURE__*/ jsxs(Flex, {
                        gap: 2,
                        children: [
                            /*#__PURE__*/ jsx(Icon, {
                                fill: "neutral500",
                                "aria-hidden": true
                            }),
                            /*#__PURE__*/ jsx(Typography, {
                                textColor: "neutral500",
                                variant: "sigma",
                                tag: "h2",
                                id: id,
                                children: formatMessage(title)
                            })
                        ]
                    }),
                    link && /*#__PURE__*/ jsx(Typography, {
                        tag: Link,
                        variant: "omega",
                        textColor: "primary600",
                        style: {
                            textDecoration: 'none'
                        },
                        to: link.href,
                        children: formatMessage(link.label)
                    })
                ]
            }),
            /*#__PURE__*/ jsxs(Box, {
                width: "100%",
                height: "261px",
                overflow: "auto",
                tag: "main",
                children: [
                    permissionStatus === 'loading' && /*#__PURE__*/ jsx(Widget.Loading, {}),
                    permissionStatus === 'forbidden' && /*#__PURE__*/ jsx(Widget.NoPermissions, {}),
                    permissionStatus === 'granted' && children
                ]
            })
        ]
    });
};
/* -------------------------------------------------------------------------------------------------
 * UnstableHomePageCe
 * -----------------------------------------------------------------------------------------------*/ const WidgetComponent = ({ component })=>{
    const [loadedComponent, setLoadedComponent] = React.useState(null);
    React.useEffect(()=>{
        const loadComponent = async ()=>{
            const resolvedComponent = await component();
            setLoadedComponent(()=>resolvedComponent);
        };
        loadComponent();
    }, [
        component
    ]);
    const Component = loadedComponent;
    if (!Component) {
        return /*#__PURE__*/ jsx(Widget.Loading, {});
    }
    return /*#__PURE__*/ jsx(Component, {});
};
/* -------------------------------------------------------------------------------------------------
 * HomePageCE
 * -----------------------------------------------------------------------------------------------*/ const HomePageCE = ()=>{
    const { formatMessage } = useIntl();
    const user = useAuth('HomePageCE', (state)=>state.user);
    const displayName = user?.firstname ?? user?.username ?? user?.email;
    const getAllWidgets = useStrapiApp('UnstableHomepageCe', (state)=>state.widgets.getAll);
    return /*#__PURE__*/ jsxs(Main, {
        children: [
            /*#__PURE__*/ jsx(Page.Title, {
                children: formatMessage({
                    id: 'HomePage.head.title',
                    defaultMessage: 'Homepage'
                })
            }),
            /*#__PURE__*/ jsx(Layouts.Header, {
                title: formatMessage({
                    id: 'HomePage.header.title',
                    defaultMessage: 'Hello {name}'
                }, {
                    name: displayName
                }),
                subtitle: formatMessage({
                    id: 'HomePage.header.subtitle',
                    defaultMessage: 'Welcome to your administration panel'
                })
            }),
            /*#__PURE__*/ jsx(FreeTrialWelcomeModal, {}),
            /*#__PURE__*/ jsx(FreeTrialEndedModal, {}),
            /*#__PURE__*/ jsx(Layouts.Content, {
                children: /*#__PURE__*/ jsxs(Flex, {
                    direction: "column",
                    alignItems: "stretch",
                    gap: 8,
                    paddingBottom: 10,
                    children: [
                        window.strapi.future.isEnabled('unstableGuidedTour') ? /*#__PURE__*/ jsx(UnstableGuidedTourOverview, {}) : /*#__PURE__*/ jsx(GuidedTour, {}),
                        /*#__PURE__*/ jsx(Grid.Root, {
                            gap: 5,
                            children: getAllWidgets().map((widget)=>{
                                return /*#__PURE__*/ jsx(Grid.Item, {
                                    col: 6,
                                    s: 12,
                                    children: /*#__PURE__*/ jsx(WidgetRoot, {
                                        title: widget.title,
                                        icon: widget.icon,
                                        permissions: widget.permissions,
                                        link: widget.link,
                                        children: /*#__PURE__*/ jsx(WidgetComponent, {
                                            component: widget.component
                                        })
                                    })
                                }, widget.uid);
                            })
                        })
                    ]
                })
            })
        ]
    });
};
/* -------------------------------------------------------------------------------------------------
 * HomePage
 * -----------------------------------------------------------------------------------------------*/ const HomePage = ()=>{
    const Page = useEnterprise(HomePageCE, // eslint-disable-next-line import/no-cycle
    async ()=>(await import('../../../../ee/admin/src/pages/HomePage.mjs')).HomePageEE);
    // block rendering until the EE component is fully loaded
    if (!Page) {
        return null;
    }
    return /*#__PURE__*/ jsx(Page, {});
};

export { HomePage, HomePageCE, WidgetRoot };
//# sourceMappingURL=HomePage.mjs.map
