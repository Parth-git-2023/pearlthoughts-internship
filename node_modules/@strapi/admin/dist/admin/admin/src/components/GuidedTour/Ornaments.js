'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var constants = require('./constants.js');

const Number = ({ children, state, ...props })=>{
    return state === constants.STATES.IS_DONE || state === constants.STATES.IS_ACTIVE ? /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
        background: "primary600",
        padding: 2,
        borderRadius: "50%",
        width: `3rem`,
        height: `3rem`,
        justifyContent: "center",
        ...props,
        children: state === constants.STATES.IS_DONE ? /*#__PURE__*/ jsxRuntime.jsx(icons.Check, {
            "aria-hidden": true,
            width: `1.6rem`,
            fill: "neutral0"
        }) : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
            fontWeight: "semiBold",
            textColor: "neutral0",
            children: children
        })
    }) : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
        borderColor: "neutral500",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: 2,
        borderRadius: "50%",
        width: `3rem`,
        height: `3rem`,
        justifyContent: "center",
        ...props,
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
            fontWeight: "semiBold",
            textColor: "neutral600",
            children: children
        })
    });
};
const VerticalDivider = ({ state, ...props })=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        width: `0.2rem`,
        height: "100%",
        background: state === constants.STATES.IS_NOT_DONE ? 'neutral300' : 'primary500',
        hasRadius: true,
        minHeight: state === constants.STATES.IS_ACTIVE ? `8.5rem` : `6.5rem`,
        ...props
    });

exports.Number = Number;
exports.VerticalDivider = VerticalDivider;
//# sourceMappingURL=Ornaments.js.map
