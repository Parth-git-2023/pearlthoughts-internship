'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');
var styled = require('styled-components');
var ActionLayout = require('./ActionLayout.js');
var ContentLayout = require('./ContentLayout.js');
var GridLayout = require('./GridLayout.js');
var HeaderLayout = require('./HeaderLayout.js');

const GridContainer = styled.styled(designSystem.Box)`
  display: grid;
  grid-template-columns: ${({ $hasSideNav })=>$hasSideNav ? `auto 1fr` : '1fr'};
`;
const OverflowingItem = styled.styled(designSystem.Box)`
  overflow-x: hidden;
`;
const RootLayout = ({ sideNav, children })=>{
    return /*#__PURE__*/ jsxRuntime.jsxs(GridContainer, {
        $hasSideNav: Boolean(sideNav),
        children: [
            sideNav,
            /*#__PURE__*/ jsxRuntime.jsx(OverflowingItem, {
                paddingBottom: 10,
                children: children
            })
        ]
    });
};
const Layouts = {
    Root: RootLayout,
    Header: HeaderLayout.HeaderLayout,
    BaseHeader: HeaderLayout.BaseHeaderLayout,
    Grid: GridLayout.GridLayout,
    Action: ActionLayout.ActionLayout,
    Content: ContentLayout.ContentLayout
};

exports.Layouts = Layouts;
//# sourceMappingURL=Layout.js.map
