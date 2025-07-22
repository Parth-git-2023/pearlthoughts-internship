import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useEffect, Suspense, lazy } from 'react';
import { useGuidedTour, useAppInfo, Page, Layouts } from '@strapi/admin/strapi-admin';
import { useIntl } from 'react-intl';
import { Routes, Route } from 'react-router-dom';
import { AutoReloadOverlayBlockerProvider } from '../../components/AutoReloadOverlayBlocker.mjs';
import { ContentTypeBuilderNav } from '../../components/ContentTypeBuilderNav/ContentTypeBuilderNav.mjs';
import DataManagerProvider from '../../components/DataManager/DataManagerProvider.mjs';
import { ExitPrompt } from '../../components/ExitPrompt.mjs';
import { FormModal } from '../../components/FormModal/FormModal.mjs';
import { FormModalNavigationProvider } from '../../components/FormModalNavigation/FormModalNavigationProvider.mjs';
import { PERMISSIONS } from '../../constants.mjs';
import { pluginId } from '../../pluginId.mjs';
import { EmptyState } from '../ListView/EmptyState.mjs';

const ListView = /*#__PURE__*/ lazy(()=>import('../ListView/ListView.mjs'));
const App = ()=>{
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Content Types Builder'
    });
    const startSection = useGuidedTour('App', (state)=>state.startSection);
    const autoReload = useAppInfo('DataManagerProvider', (state)=>state.autoReload);
    const startSectionRef = useRef(startSection);
    useEffect(()=>{
        if (startSectionRef.current) {
            startSectionRef.current('contentTypeBuilder');
        }
    }, []);
    return /*#__PURE__*/ jsxs(Page.Protect, {
        permissions: PERMISSIONS.main,
        children: [
            /*#__PURE__*/ jsx(Page.Title, {
                children: title
            }),
            /*#__PURE__*/ jsx(AutoReloadOverlayBlockerProvider, {
                children: /*#__PURE__*/ jsx(FormModalNavigationProvider, {
                    children: /*#__PURE__*/ jsxs(DataManagerProvider, {
                        children: [
                            /*#__PURE__*/ jsx(ExitPrompt, {}),
                            /*#__PURE__*/ jsxs(Fragment, {
                                children: [
                                    autoReload && /*#__PURE__*/ jsx(FormModal, {}),
                                    /*#__PURE__*/ jsx(Layouts.Root, {
                                        sideNav: /*#__PURE__*/ jsx(ContentTypeBuilderNav, {}),
                                        children: /*#__PURE__*/ jsx(Suspense, {
                                            fallback: /*#__PURE__*/ jsx(Page.Loading, {}),
                                            children: /*#__PURE__*/ jsxs(Routes, {
                                                children: [
                                                    /*#__PURE__*/ jsx(Route, {
                                                        path: "content-types/create-content-type",
                                                        element: /*#__PURE__*/ jsx(EmptyState, {})
                                                    }),
                                                    /*#__PURE__*/ jsx(Route, {
                                                        path: "content-types/:contentTypeUid",
                                                        element: /*#__PURE__*/ jsx(ListView, {})
                                                    }),
                                                    /*#__PURE__*/ jsx(Route, {
                                                        path: `component-categories/:categoryUid/:componentUid`,
                                                        element: /*#__PURE__*/ jsx(ListView, {})
                                                    }),
                                                    /*#__PURE__*/ jsx(Route, {
                                                        path: "*",
                                                        element: /*#__PURE__*/ jsx(ListView, {})
                                                    })
                                                ]
                                            })
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                })
            })
        ]
    });
};

export { App as default };
//# sourceMappingURL=index.mjs.map
