'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');

const ContentLayout = ({ children })=>{
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        paddingLeft: 10,
        paddingRight: 10,
        children: children
    });
};

exports.ContentLayout = ContentLayout;
//# sourceMappingURL=ContentLayout.js.map
