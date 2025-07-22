'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');
var Icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styledComponents = require('styled-components');
var collections = require('../../constants/collections.js');
var DocumentRBAC = require('../../features/DocumentRBAC.js');
var useDocument = require('../../hooks/useDocument.js');
var useDocumentLayout = require('../../hooks/useDocumentLayout.js');
var FormLayout = require('../../pages/EditView/components/FormLayout.js');
var api = require('../../utils/api.js');
var validation = require('../../utils/validation.js');
var PreviewHeader = require('../components/PreviewHeader.js');
var preview = require('../services/preview.js');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

const [PreviewProvider, usePreviewContext] = strapiAdmin.createContext('PreviewPage');
/* -------------------------------------------------------------------------------------------------
 * PreviewPage
 * -----------------------------------------------------------------------------------------------*/ const AnimatedArrow = styledComponents.styled(Icons.ArrowLineLeft)`
  will-change: transform;
  rotate: ${(props)=>props.isSideEditorOpen ? '0deg' : '180deg'};
  transition: rotate 0.2s ease-in-out;
`;
const PreviewPage = ()=>{
    const location = reactRouterDom.useLocation();
    const { formatMessage } = reactIntl.useIntl();
    const iframeRef = React__namespace.useRef(null);
    const [isSideEditorOpen, setIsSideEditorOpen] = React__namespace.useState(true);
    // Read all the necessary data from the URL to find the right preview URL
    const { slug: model, id: documentId, collectionType } = reactRouterDom.useParams();
    const [{ query }] = strapiAdmin.useQueryParams();
    const params = React__namespace.useMemo(()=>api.buildValidParams(query), [
        query
    ]);
    if (!collectionType) {
        throw new Error('Could not find collectionType in url params');
    }
    if (!model) {
        throw new Error('Could not find model in url params');
    }
    // Only collection types must have a documentId
    if (collectionType === collections.COLLECTION_TYPES && !documentId) {
        throw new Error('Could not find documentId in url params');
    }
    const previewUrlResponse = preview.useGetPreviewUrlQuery({
        params: {
            contentType: model
        },
        query: {
            documentId,
            locale: params.locale,
            status: params.status
        }
    });
    const documentResponse = useDocument.useDocument({
        model,
        collectionType,
        documentId,
        params
    });
    const documentLayoutResponse = useDocumentLayout.useDocumentLayout(model);
    const isLoading = previewUrlResponse.isLoading || documentLayoutResponse.isLoading || documentResponse.isLoading;
    if (isLoading && !documentResponse.document?.documentId) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
    }
    const initialValues = documentResponse.getInitialFormValues();
    if (previewUrlResponse.error || documentLayoutResponse.error || !documentResponse.document || !documentResponse.meta || !documentResponse.schema || !initialValues) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Error, {});
    }
    if (!previewUrlResponse.data?.data?.url) {
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.NoData, {});
    }
    const documentTitle = documentResponse.getTitle(documentLayoutResponse.edit.settings.mainField);
    const validateSync = (values, options)=>{
        const yupSchema = validation.createYupSchema(documentResponse.schema?.attributes, documentResponse.components, {
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
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Title, {
                children: formatMessage({
                    id: 'content-manager.preview.page-title',
                    defaultMessage: '{contentType} preview'
                }, {
                    contentType: documentTitle
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(PreviewProvider, {
                url: previewUrl,
                document: documentResponse.document,
                title: documentTitle,
                meta: documentResponse.meta,
                schema: documentResponse.schema,
                layout: documentLayoutResponse.edit,
                onPreview: onPreview,
                children: /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Form, {
                    method: "PUT",
                    disabled: query.status === 'published' && documentResponse && documentResponse.document.status !== 'draft',
                    initialValues: documentResponse.getInitialFormValues(),
                    initialErrors: location?.state?.forceValidation ? validateSync(initialValues, {}) : {},
                    height: "100%",
                    validate: (values, options)=>{
                        const yupSchema = validation.createYupSchema(documentResponse.schema?.attributes, documentResponse.components, {
                            status: documentResponse.document?.status,
                            ...options
                        });
                        return yupSchema.validate(values, {
                            abortEarly: false
                        });
                    },
                    children: ({ resetForm })=>/*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                            direction: "column",
                            height: "100%",
                            alignItems: "stretch",
                            children: [
                                /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Blocker, {
                                    onProceed: resetForm
                                }),
                                /*#__PURE__*/ jsxRuntime.jsx(PreviewHeader.PreviewHeader, {}),
                                /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                                    flex: 1,
                                    overflow: "auto",
                                    alignItems: "stretch",
                                    children: [
                                        hasAdvancedPreview && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
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
                                            children: /*#__PURE__*/ jsxRuntime.jsx(FormLayout.FormLayout, {
                                                layout: documentLayoutResponse.edit.layout,
                                                document: documentResponse,
                                                hasBackground: false
                                            })
                                        }),
                                        /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                                            position: "relative",
                                            flex: 1,
                                            height: "100%",
                                            overflow: "hidden",
                                            children: [
                                                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
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
                                                hasAdvancedPreview && /*#__PURE__*/ jsxRuntime.jsx(designSystem.IconButton, {
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
                                                    children: /*#__PURE__*/ jsxRuntime.jsx(AnimatedArrow, {
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
    const { slug: model } = reactRouterDom.useParams();
    const { permissions = [], isLoading, error } = strapiAdmin.useRBAC([
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
        return /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
    }
    if (error || !model) {
        return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2,
            background: "neutral0",
            children: /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Error, {})
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
        background: "neutral0",
        children: /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Protect, {
            permissions: permissions.filter((permission)=>permission.action.includes('explorer.read')),
            children: /*#__PURE__*/ jsxRuntime.jsx(DocumentRBAC.DocumentRBAC, {
                permissions: permissions,
                children: /*#__PURE__*/ jsxRuntime.jsx(PreviewPage, {})
            })
        })
    });
};
const ProtectedPreviewPage = ()=>{
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Portal, {
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.FocusTrap, {
            children: /*#__PURE__*/ jsxRuntime.jsx(ProtectedPreviewPageImpl, {})
        })
    });
};

exports.ProtectedPreviewPage = ProtectedPreviewPage;
exports.usePreviewContext = usePreviewContext;
//# sourceMappingURL=Preview.js.map
