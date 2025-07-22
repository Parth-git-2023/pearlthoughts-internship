import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { createContext, useRBAC, Page, useQueryParams, Form, Blocker } from '@strapi/admin/strapi-admin';
import { Portal, FocusTrap, Box, Flex, IconButton } from '@strapi/design-system';
import { ArrowLineLeft } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useParams, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { COLLECTION_TYPES } from '../../constants/collections.mjs';
import { DocumentRBAC } from '../../features/DocumentRBAC.mjs';
import { useDocument } from '../../hooks/useDocument.mjs';
import { useDocumentLayout } from '../../hooks/useDocumentLayout.mjs';
import { FormLayout } from '../../pages/EditView/components/FormLayout.mjs';
import { buildValidParams } from '../../utils/api.mjs';
import { createYupSchema } from '../../utils/validation.mjs';
import { PreviewHeader } from '../components/PreviewHeader.mjs';
import { useGetPreviewUrlQuery } from '../services/preview.mjs';

const [PreviewProvider, usePreviewContext] = createContext('PreviewPage');
/* -------------------------------------------------------------------------------------------------
 * PreviewPage
 * -----------------------------------------------------------------------------------------------*/ const AnimatedArrow = styled(ArrowLineLeft)`
  will-change: transform;
  rotate: ${(props)=>props.isSideEditorOpen ? '0deg' : '180deg'};
  transition: rotate 0.2s ease-in-out;
`;
const PreviewPage = ()=>{
    const location = useLocation();
    const { formatMessage } = useIntl();
    const iframeRef = React.useRef(null);
    const [isSideEditorOpen, setIsSideEditorOpen] = React.useState(true);
    // Read all the necessary data from the URL to find the right preview URL
    const { slug: model, id: documentId, collectionType } = useParams();
    const [{ query }] = useQueryParams();
    const params = React.useMemo(()=>buildValidParams(query), [
        query
    ]);
    if (!collectionType) {
        throw new Error('Could not find collectionType in url params');
    }
    if (!model) {
        throw new Error('Could not find model in url params');
    }
    // Only collection types must have a documentId
    if (collectionType === COLLECTION_TYPES && !documentId) {
        throw new Error('Could not find documentId in url params');
    }
    const previewUrlResponse = useGetPreviewUrlQuery({
        params: {
            contentType: model
        },
        query: {
            documentId,
            locale: params.locale,
            status: params.status
        }
    });
    const documentResponse = useDocument({
        model,
        collectionType,
        documentId,
        params
    });
    const documentLayoutResponse = useDocumentLayout(model);
    const isLoading = previewUrlResponse.isLoading || documentLayoutResponse.isLoading || documentResponse.isLoading;
    if (isLoading && !documentResponse.document?.documentId) {
        return /*#__PURE__*/ jsx(Page.Loading, {});
    }
    const initialValues = documentResponse.getInitialFormValues();
    if (previewUrlResponse.error || documentLayoutResponse.error || !documentResponse.document || !documentResponse.meta || !documentResponse.schema || !initialValues) {
        return /*#__PURE__*/ jsx(Page.Error, {});
    }
    if (!previewUrlResponse.data?.data?.url) {
        return /*#__PURE__*/ jsx(Page.NoData, {});
    }
    const documentTitle = documentResponse.getTitle(documentLayoutResponse.edit.settings.mainField);
    const validateSync = (values, options)=>{
        const yupSchema = createYupSchema(documentResponse.schema?.attributes, documentResponse.components, {
            status: documentResponse.document?.status,
            ...options
        });
        return yupSchema.validateSync(values, {
            abortEarly: false
        });
    };
    const previewUrl = previewUrlResponse.data.data.url;
    const onPreview = ()=>{
        iframeRef?.current?.contentWindow?.postMessage({
            type: 'strapiUpdate'
        }, // The iframe origin is safe to use since it must be provided through the allowedOrigins config
        new URL(iframeRef.current.src).origin);
    };
    const hasAdvancedPreview = window.strapi.features.isEnabled('cms-advanced-preview');
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx(Page.Title, {
                children: formatMessage({
                    id: 'content-manager.preview.page-title',
                    defaultMessage: '{contentType} preview'
                }, {
                    contentType: documentTitle
                })
            }),
            /*#__PURE__*/ jsx(PreviewProvider, {
                url: previewUrl,
                document: documentResponse.document,
                title: documentTitle,
                meta: documentResponse.meta,
                schema: documentResponse.schema,
                layout: documentLayoutResponse.edit,
                onPreview: onPreview,
                children: /*#__PURE__*/ jsx(Form, {
                    method: "PUT",
                    disabled: query.status === 'published' && documentResponse && documentResponse.document.status !== 'draft',
                    initialValues: documentResponse.getInitialFormValues(),
                    initialErrors: location?.state?.forceValidation ? validateSync(initialValues, {}) : {},
                    height: "100%",
                    validate: (values, options)=>{
                        const yupSchema = createYupSchema(documentResponse.schema?.attributes, documentResponse.components, {
                            status: documentResponse.document?.status,
                            ...options
                        });
                        return yupSchema.validate(values, {
                            abortEarly: false
                        });
                    },
                    children: ({ resetForm })=>/*#__PURE__*/ jsxs(Flex, {
                            direction: "column",
                            height: "100%",
                            alignItems: "stretch",
                            children: [
                                /*#__PURE__*/ jsx(Blocker, {
                                    onProceed: resetForm
                                }),
                                /*#__PURE__*/ jsx(PreviewHeader, {}),
                                /*#__PURE__*/ jsxs(Flex, {
                                    flex: 1,
                                    overflow: "auto",
                                    alignItems: "stretch",
                                    children: [
                                        hasAdvancedPreview && /*#__PURE__*/ jsx(Box, {
                                            overflow: "auto",
                                            width: isSideEditorOpen ? '50%' : 0,
                                            borderWidth: "0 1px 0 0",
                                            borderColor: "neutral150",
                                            paddingTop: 6,
                                            paddingBottom: 6,
                                            // Remove horizontal padding when the editor is closed or it won't fully disappear
                                            paddingLeft: isSideEditorOpen ? 6 : 0,
                                            paddingRight: isSideEditorOpen ? 6 : 0,
                                            transition: "all 0.2s ease-in-out",
                                            children: /*#__PURE__*/ jsx(FormLayout, {
                                                layout: documentLayoutResponse.edit.layout,
                                                document: documentResponse,
                                                hasBackground: false
                                            })
                                        }),
                                        /*#__PURE__*/ jsxs(Box, {
                                            position: "relative",
                                            flex: 1,
                                            height: "100%",
                                            overflow: "hidden",
                                            children: [
                                                /*#__PURE__*/ jsx(Box, {
                                                    "data-testid": "preview-iframe",
                                                    ref: iframeRef,
                                                    src: previewUrl,
                                                    title: formatMessage({
                                                        id: 'content-manager.preview.panel.title',
                                                        defaultMessage: 'Preview'
                                                    }),
                                                    width: "100%",
                                                    height: "100%",
                                                    borderWidth: 0,
                                                    tag: "iframe"
                                                }, previewUrl),
                                                hasAdvancedPreview && /*#__PURE__*/ jsx(IconButton, {
                                                    variant: "tertiary",
                                                    label: formatMessage(isSideEditorOpen ? {
                                                        id: 'content-manager.preview.content.close-editor',
                                                        defaultMessage: 'Close editor'
                                                    } : {
                                                        id: 'content-manager.preview.content.open-editor',
                                                        defaultMessage: 'Open editor'
                                                    }),
                                                    onClick: ()=>setIsSideEditorOpen((prev)=>!prev),
                                                    position: "absolute",
                                                    top: 2,
                                                    left: 2,
                                                    children: /*#__PURE__*/ jsx(AnimatedArrow, {
                                                        isSideEditorOpen: isSideEditorOpen
                                                    })
                                                })
                                            ]
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
/* -------------------------------------------------------------------------------------------------
 * ProtectedPreviewPage
 * -----------------------------------------------------------------------------------------------*/ const ProtectedPreviewPageImpl = ()=>{
    const { slug: model } = useParams();
    const { permissions = [], isLoading, error } = useRBAC([
        {
            action: 'plugin::content-manager.explorer.read',
            subject: model
        },
        {
            action: 'plugin::content-manager.explorer.update',
            subject: model
        },
        {
            action: 'plugin::content-manager.explorer.publish',
            subject: model
        }
    ]);
    if (isLoading) {
        return /*#__PURE__*/ jsx(Page.Loading, {});
    }
    if (error || !model) {
        return /*#__PURE__*/ jsx(Box, {
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2,
            background: "neutral0",
            children: /*#__PURE__*/ jsx(Page.Error, {})
        });
    }
    return /*#__PURE__*/ jsx(Box, {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
        background: "neutral0",
        children: /*#__PURE__*/ jsx(Page.Protect, {
            permissions: permissions.filter((permission)=>permission.action.includes('explorer.read')),
            children: /*#__PURE__*/ jsx(DocumentRBAC, {
                permissions: permissions,
                children: /*#__PURE__*/ jsx(PreviewPage, {})
            })
        })
    });
};
const ProtectedPreviewPage = ()=>{
    return /*#__PURE__*/ jsx(Portal, {
        children: /*#__PURE__*/ jsx(FocusTrap, {
            children: /*#__PURE__*/ jsx(ProtectedPreviewPageImpl, {})
        })
    });
};

export { ProtectedPreviewPage, usePreviewContext };
//# sourceMappingURL=Preview.mjs.map
