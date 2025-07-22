import { jsx } from 'react/jsx-runtime';
import 'react';
import { useTracking, useQueryParams, useForm } from '@strapi/admin/strapi-admin';
import { Box, Button, Tooltip } from '@strapi/design-system';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';
import { useLocation, Link } from 'react-router-dom';
import { useGetPreviewUrlQuery } from '../services/preview.mjs';

const ConditionalTooltip = ({ isShown, label, children })=>{
    if (isShown) {
        return /*#__PURE__*/ jsx(Tooltip, {
            label: label,
            children: children
        });
    }
    return children;
};
const PreviewSidePanel = ({ model, documentId, document })=>{
    const { formatMessage } = useIntl();
    const { trackUsage } = useTracking();
    const { pathname } = useLocation();
    const [{ query }] = useQueryParams();
    const isModified = useForm('PreviewSidePanel', (state)=>state.modified);
    /**
   * The preview URL isn't used in this component, we just fetch it to know if preview is enabled
   * for the content type. If it's not, the panel is not displayed. If it is, we display a link to
   * /preview, and the URL will already be loaded in the RTK query cache.
   */ const { data, error } = useGetPreviewUrlQuery({
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
        content: /*#__PURE__*/ jsx(ConditionalTooltip, {
            label: formatMessage({
                id: 'content-manager.preview.panel.button-disabled-tooltip',
                defaultMessage: 'Please save to open the preview'
            }),
            isShown: isModified,
            children: /*#__PURE__*/ jsx(Box, {
                cursor: "not-allowed",
                width: "100%",
                children: /*#__PURE__*/ jsx(Button, {
                    variant: "tertiary",
                    tag: Link,
                    to: {
                        pathname: 'preview',
                        search: stringify(query, {
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

export { PreviewSidePanel };
//# sourceMappingURL=PreviewSidePanel.mjs.map
