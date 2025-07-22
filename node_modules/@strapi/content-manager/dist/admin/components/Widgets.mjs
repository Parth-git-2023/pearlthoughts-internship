import { jsx, jsxs } from 'react/jsx-runtime';
import { Widget, useTracking } from '@strapi/admin/strapi-admin';
import { Typography, Table, Tbody, Tr, Td, Box, IconButton } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useNavigate, Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { DocumentStatus } from '../pages/EditView/components/DocumentStatus.mjs';
import { useGetRecentDocumentsQuery } from '../services/homepage.mjs';
import { RelativeTime } from './RelativeTime.mjs';

const CellTypography = styled(Typography).attrs({
    maxWidth: '14.4rem',
    display: 'block'
})`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const RecentDocumentsTable = ({ documents })=>{
    const { formatMessage } = useIntl();
    const { trackUsage } = useTracking();
    const navigate = useNavigate();
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
    return /*#__PURE__*/ jsx(Table, {
        colCount: 5,
        rowCount: documents?.length ?? 0,
        children: /*#__PURE__*/ jsx(Tbody, {
            children: documents?.map((document)=>/*#__PURE__*/ jsxs(Tr, {
                    onClick: handleRowClick(document),
                    cursor: "pointer",
                    children: [
                        /*#__PURE__*/ jsx(Td, {
                            children: /*#__PURE__*/ jsx(CellTypography, {
                                title: document.title,
                                variant: "omega",
                                textColor: "neutral800",
                                children: document.title
                            })
                        }),
                        /*#__PURE__*/ jsx(Td, {
                            children: /*#__PURE__*/ jsx(CellTypography, {
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
                        /*#__PURE__*/ jsx(Td, {
                            children: /*#__PURE__*/ jsx(Box, {
                                display: "inline-block",
                                children: document.status ? /*#__PURE__*/ jsx(DocumentStatus, {
                                    status: document.status
                                }) : /*#__PURE__*/ jsx(Typography, {
                                    textColor: "neutral600",
                                    "aria-hidden": true,
                                    children: "-"
                                })
                            })
                        }),
                        /*#__PURE__*/ jsx(Td, {
                            children: /*#__PURE__*/ jsx(Typography, {
                                textColor: "neutral600",
                                children: /*#__PURE__*/ jsx(RelativeTime, {
                                    timestamp: new Date(document.updatedAt)
                                })
                            })
                        }),
                        /*#__PURE__*/ jsx(Td, {
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ jsx(Box, {
                                display: "inline-block",
                                children: /*#__PURE__*/ jsx(IconButton, {
                                    tag: Link,
                                    to: getEditViewLink(document),
                                    onClick: ()=>trackUsage('willEditEntryFromHome'),
                                    label: formatMessage({
                                        id: 'content-manager.actions.edit.label',
                                        defaultMessage: 'Edit'
                                    }),
                                    variant: "ghost",
                                    children: /*#__PURE__*/ jsx(Pencil, {})
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
    const { formatMessage } = useIntl();
    const { data, isLoading, error } = useGetRecentDocumentsQuery({
        action: 'update'
    });
    if (isLoading) {
        return /*#__PURE__*/ jsx(Widget.Loading, {});
    }
    if (error || !data) {
        return /*#__PURE__*/ jsx(Widget.Error, {});
    }
    if (data.length === 0) {
        return /*#__PURE__*/ jsx(Widget.NoData, {
            children: formatMessage({
                id: 'content-manager.widget.last-edited.no-data',
                defaultMessage: 'No edited entries'
            })
        });
    }
    return /*#__PURE__*/ jsx(RecentDocumentsTable, {
        documents: data
    });
};
/* -------------------------------------------------------------------------------------------------
 * LastPublishedWidget
 * -----------------------------------------------------------------------------------------------*/ const LastPublishedWidget = ()=>{
    const { formatMessage } = useIntl();
    const { data, isLoading, error } = useGetRecentDocumentsQuery({
        action: 'publish'
    });
    if (isLoading) {
        return /*#__PURE__*/ jsx(Widget.Loading, {});
    }
    if (error || !data) {
        return /*#__PURE__*/ jsx(Widget.Error, {});
    }
    if (data.length === 0) {
        return /*#__PURE__*/ jsx(Widget.NoData, {
            children: formatMessage({
                id: 'content-manager.widget.last-published.no-data',
                defaultMessage: 'No published entries'
            })
        });
    }
    return /*#__PURE__*/ jsx(RecentDocumentsTable, {
        documents: data
    });
};

export { LastEditedWidget, LastPublishedWidget };
//# sourceMappingURL=Widgets.mjs.map
