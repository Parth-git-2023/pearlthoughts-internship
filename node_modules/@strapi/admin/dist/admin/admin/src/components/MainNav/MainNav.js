'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var styled = require('styled-components');

const MainNavWrapper = styled.styled(designSystem.Flex)`
  border-right: 1px solid ${({ theme })=>theme.colors.neutral150};
`;
const MainNav = (props)=>/*#__PURE__*/ jsxRuntime.jsx(MainNavWrapper, {
        alignItems: "normal",
        tag: "nav",
        background: "neutral0",
        direction: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 2,
        width: 10,
        ...props
    });

exports.MainNav = MainNav;
//# sourceMappingURL=MainNav.js.map
