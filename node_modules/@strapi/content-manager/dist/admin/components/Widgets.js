'use strict';

var jsxRuntime = require('react/jsx-runtime');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');
var Icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styledComponents = require('styled-components');
var DocumentStatus = require('../pages/EditView/components/DocumentStatus.js');
var homepage = require('../services/homepage.js');
var RelativeTime = require('./RelativeTime.js');

const CellTypography = styledComponents.styled(designSystem.Typography).attrs({
    maxWidth: '14.4rem',
    display: 'block'
})`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const RecentDocumentsTable = ({ documents })=>{
    const { formatMessage } = reactIntl.useIntl();
    const { trackUsage } = strapiAdmin.useTracking();
    const navigate = reactRouterDom.useNavigate();
    const getEditViewLink = (document)=>{
        const isSingleType = document.kind === 'singleType';
        const kindPath = isSingleType ? 'single-types' : 'collection-types';
        const queryParams = document.locale ? `?plugins[i18n][locale]=${document.locale}` : '';
        return `/content-manager/${kindPath}/${document.contentTypeUid}${isSingleType ? '' : '/' + document.documentId}${queryParams}`;
    };
    const handleRowClick = (document)=>()=>{
            trackUsage('willEditEntryFromHome');
            const link = getEditViewLink(document);
            navigate(link);
        };
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Table, {
        colCount: 5,
        rowCount: documents?.length ?? 0,
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Tbody, {
            children: documents?.map((document)=>/*#__PURE__*/ jsxRuntime.jsxs(designSystem.Tr, {
                    onClick: handleRowClick(document),
                    cursor: "pointer",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Td, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(CellTypography, {
                                title: document.title,
                                variant: "omega",
                                textColor: "neutral800",
                                children: document.title
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Td, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(CellTypography, {
                                variant: "omega",
                                textColor: "neutral600",
                                children: document.kind === 'singleType' ? formatMessage({
                                    id: 'content-manager.widget.last-edited.single-type',
                                    defaultMessage: 'Single-Type'
                                }) : formatMessage({
                                    id: document.contentTypeDisplayName,
                                    defaultMessage: document.contentTypeDisplayName
                                })
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Td, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                display: "inline-block",
                                children: document.status ? /*#__PURE__*/ jsxRuntime.jsx(DocumentStatus.DocumentStatus, {
                                    status: document.status
                                }) : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                    textColor: "neutral600",
                                    "aria-hidden": true,
                                    children: "-"
                                })
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Td, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                textColor: "neutral600",
                                children: /*#__PURE__*/ jsxRuntime.jsx(RelativeTime.RelativeTime, {
                                    timestamp: new Date(document.updatedAt)
                                })
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Td, {
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                display: "inline-block",
                                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.IconButton, {
                                    tag: reactRouterDom.Link,
                                    to: getEditViewLink(document),
                                    onClick: ()=>trackUsage('willEditEntryFromHome'),
                                    label: formatMessage({
                                        id: 'content-manager.actions.edit.label',
                                        defaultMessage: 'Edit'
                                    }),
                                    variant: "ghost",
                                    children: /*#__PURE__*/ jsxRuntime.jsx(Icons.Pencil, {})
                                })
                            })
                        })
                    ]
                }, document.documentId))
        })
    });
};
/* -------------------------------------------------------------------------------------------------
 * LastEditedWidget
 * -----------------------------------------------------------------------------------------------*/ const LastEditedWidget = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    const { data, isLoading, error } = homepage.useGetRecentDocumentsQuery({
        action: 'update'
    });
    if (isLoading) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.Loading, {});
    }
    if (error || !data) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.Error, {});
    }
    if (data.length === 0) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.NoData, {
            children: formatMessage({
                id: 'content-manager.widget.last-edited.no-data',
                defaultMessage: 'No edited entries'
            })
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsx(RecentDocumentsTable, {
        documents: data
    });
};
/* -------------------------------------------------------------------------------------------------
 * LastPublishedWidget
 * -----------------------------------------------------------------------------------------------*/ const LastPublishedWidget = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    const { data, isLoading, error } = homepage.useGetRecentDocumentsQuery({
        action: 'publish'
    });
    if (isLoading) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.Loading, {});
    }
    if (error || !data) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.Error, {});
    }
    if (data.length === 0) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Widget.NoData, {
            children: formatMessage({
                id: 'content-manager.widget.last-published.no-data',
                defaultMessage: 'No published entries'
            })
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsx(RecentDocumentsTable, {
        documents: data
    });
};

exports.LastEditedWidget = LastEditedWidget;
exports.LastPublishedWidget = LastPublishedWidget;
//# sourceMappingURL=Widgets.js.map
