'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');

const ActionLayout = ({ startActions, endActions })=>{
    if (!startActions && !endActions) {
        return null;
    }
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                gap: 2,
                wrap: "wrap",
                children: startActions
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                gap: 2,
                shrink: 0,
                wrap: "wrap",
                children: endActions
            })
        ]
    });
};

exports.ActionLayout = ActionLayout;
//# sourceMappingURL=ActionLayout.js.map
