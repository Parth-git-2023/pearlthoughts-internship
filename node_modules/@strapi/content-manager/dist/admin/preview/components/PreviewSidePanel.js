'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');
var qs = require('qs');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var preview = require('../services/preview.js');

const ConditionalTooltip = ({ isShown, label, children })=>{
    if (isShown) {
        return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Tooltip, {
            label: label,
            children: children
        });
    }
    return children;
};
const PreviewSidePanel = ({ model, documentId, document })=>{
    const { formatMessage } = reactIntl.useIntl();
    const { trackUsage } = strapiAdmin.useTracking();
    const { pathname } = reactRouterDom.useLocation();
    const [{ query }] = strapiAdmin.useQueryParams();
    const isModified = strapiAdmin.useForm('PreviewSidePanel', (state)=>state.modified);
    /**
   * The preview URL isn't used in this component, we just fetch it to know if preview is enabled
   * for the content type. If it's not, the panel is not displayed. If it is, we display a link to
   * /preview, and the URL will already be loaded in the RTK query cache.
   */ const { data, error } = preview.useGetPreviewUrlQuery({
        params: {
            contentType: model
        },
        query: {
            documentId,
            locale: document?.locale,
            status: document?.status
        }
    });
    if (!data?.data?.url || error) {
        return null;
    }
    const trackNavigation = ()=>{
        // Append /preview to the current URL
        const destinationPathname = pathname.replace(/\/$/, '') + '/preview';
        trackUsage('willNavigate', {
            from: pathname,
            to: destinationPathname
        });
    };
    return {
        title: formatMessage({
            id: 'content-manager.preview.panel.title',
            defaultMessage: 'Preview'
        }),
        content: /*#__PURE__*/ jsxRuntime.jsx(ConditionalTooltip, {
            label: formatMessage({
                id: 'content-manager.preview.panel.button-disabled-tooltip',
                defaultMessage: 'Please save to open the preview'
            }),
            isShown: isModified,
            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                cursor: "not-allowed",
                width: "100%",
                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
                    variant: "tertiary",
                    tag: reactRouterDom.Link,
                    to: {
                        pathname: 'preview',
                        search: qs.stringify(query, {
                            encode: false
                        })
                    },
                    onClick: trackNavigation,
                    width: "100%",
                    disabled: isModified,
                    pointerEvents: isModified ? 'none' : undefined,
                    tabIndex: isModified ? -1 : undefined,
                    children: formatMessage({
                        id: 'content-manager.preview.panel.button',
                        defaultMessage: 'Open preview'
                    })
                })
            })
        })
    };
};

exports.PreviewSidePanel = PreviewSidePanel;
//# sourceMappingURL=PreviewSidePanel.js.map
