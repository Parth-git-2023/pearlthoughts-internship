'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var DragLayer = require('./components/DragLayer.js');
var CardDragPreview = require('./components/DragPreviews/CardDragPreview.js');
var ComponentDragPreview = require('./components/DragPreviews/ComponentDragPreview.js');
var RelationDragPreview = require('./components/DragPreviews/RelationDragPreview.js');
var LeftMenu = require('./components/LeftMenu.js');
var dragAndDrop = require('./constants/dragAndDrop.js');
var useContentManagerInitData = require('./hooks/useContentManagerInitData.js');
var translations = require('./utils/translations.js');

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

/* -------------------------------------------------------------------------------------------------
 * Layout
 * -----------------------------------------------------------------------------------------------*/ const Layout = ()=>{
    const contentTypeMatch = reactRouterDom.useMatch('/content-manager/:kind/:uid/*');
    const { isLoading, collectionTypeLinks, models, singleTypeLinks } = useContentManagerInitData.useContentManagerInitData();
    const authorisedModels = [
        ...collectionTypeLinks,
        ...singleTypeLinks
    ].sort((a, b)=>a.title.localeCompare(b.title));
    const { pathname } = reactRouterDom.useLocation();
    const { formatMessage } = reactIntl.useIntl();
    const startSection = strapiAdmin.useGuidedTour('Layout', (state)=>state.startSection);
    const startSectionRef = React__namespace.useRef(startSection);
    React__namespace.useEffect(()=>{
        if (startSectionRef.current) {
            startSectionRef.current('contentManager');
        }
    }, []);
    if (isLoading) {
        return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [
                /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Title, {
                    children: formatMessage({
                        id: translations.getTranslation('plugin.name'),
                        defaultMessage: 'Content Manager'
                    })
                }),
                /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Loading, {})
            ]
        });
    }
    // Array of models that are displayed in the content manager
    const supportedModelsToDisplay = models.filter(({ isDisplayed })=>isDisplayed);
    // Redirect the user to the 403 page
    if (authorisedModels.length === 0 && supportedModelsToDisplay.length > 0 && pathname !== '/content-manager/403') {
        return /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Navigate, {
            to: "/403"
        });
    }
    // Redirect the user to the create content type page
    if (supportedModelsToDisplay.length === 0 && pathname !== '/no-content-types') {
        return /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Navigate, {
            to: "/no-content-types"
        });
    }
    if (!contentTypeMatch && authorisedModels.length > 0) {
        return /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Navigate, {
            to: {
                pathname: authorisedModels[0].to,
                search: authorisedModels[0].search ?? ''
            },
            replace: true
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Page.Title, {
                children: formatMessage({
                    id: translations.getTranslation('plugin.name'),
                    defaultMessage: 'Content Manager'
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(strapiAdmin.Layouts.Root, {
                sideNav: /*#__PURE__*/ jsxRuntime.jsx(LeftMenu.LeftMenu, {}),
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(DragLayer.DragLayer, {
                        renderItem: renderDraglayerItem
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(reactRouterDom.Outlet, {})
                ]
            })
        ]
    });
};
/* -------------------------------------------------------------------------------------------------
 * renderDraglayerItem
 * -----------------------------------------------------------------------------------------------*/ function renderDraglayerItem({ type, item }) {
    if (!type || type && typeof type !== 'string') {
        return null;
    }
    /**
   * Because a user may have multiple relations / dynamic zones / repeable fields in the same content type,
   * we append the fieldName for the item type to make them unique, however, we then want to extract that
   * first type to apply the correct preview.
   */ const [actualType] = type.split('_');
    switch(actualType){
        case dragAndDrop.ItemTypes.EDIT_FIELD:
        case dragAndDrop.ItemTypes.FIELD:
            return /*#__PURE__*/ jsxRuntime.jsx(CardDragPreview.CardDragPreview, {
                label: item.label
            });
        case dragAndDrop.ItemTypes.COMPONENT:
        case dragAndDrop.ItemTypes.DYNAMIC_ZONE:
            return /*#__PURE__*/ jsxRuntime.jsx(ComponentDragPreview.ComponentDragPreview, {
                displayedValue: item.displayedValue
            });
        case dragAndDrop.ItemTypes.RELATION:
            return /*#__PURE__*/ jsxRuntime.jsx(RelationDragPreview.RelationDragPreview, {
                ...item
            });
        default:
            return null;
    }
}

exports.Layout = Layout;
//# sourceMappingURL=layout.js.map
