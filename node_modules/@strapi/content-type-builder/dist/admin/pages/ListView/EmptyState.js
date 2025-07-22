'use strict';

var jsxRuntime = require('react/jsx-runtime');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');
var reactIntl = require('react-intl');
var getTrad = require('../../utils/getTrad.js');

const EmptyState = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    const pluginName = formatMessage({
        id: getTrad.getTrad('plugin.name'),
        defaultMessage: 'Content-Type Builder'
    });
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.unstable_tours.contentTypeBuilder.Introduction, {
                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    paddingTop: 5
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                direction: "column",
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "alpha",
                        children: pluginName
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "delta",
                        children: formatMessage({
                            id: getTrad.getTrad('table.content.create-first-content-type'),
                            defaultMessage: 'Create your first Collection-Type'
                        })
                    })
                ]
            })
        ]
    });
};

exports.EmptyState = EmptyState;
//# sourceMappingURL=EmptyState.js.map
