import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { Box } from '@strapi/design-system';
import { styled } from 'styled-components';
import { ActionLayout } from './ActionLayout.mjs';
import { ContentLayout } from './ContentLayout.mjs';
import { GridLayout } from './GridLayout.mjs';
import { HeaderLayout, BaseHeaderLayout } from './HeaderLayout.mjs';

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: ${({ $hasSideNav })=>$hasSideNav ? `auto 1fr` : '1fr'};
`;
const OverflowingItem = styled(Box)`
  overflow-x: hidden;
`;
const RootLayout = ({ sideNav, children })=>{
    return /*#__PURE__*/ jsxs(GridContainer, {
        $hasSideNav: Boolean(sideNav),
        children: [
            sideNav,
            /*#__PURE__*/ jsx(OverflowingItem, {
                paddingBottom: 10,
                children: children
            })
        ]
    });
};
const Layouts = {
    Root: RootLayout,
    Header: HeaderLayout,
    BaseHeader: BaseHeaderLayout,
    Grid: GridLayout,
    Action: ActionLayout,
    Content: ContentLayout
};

export { Layouts };
//# sourceMappingURL=Layout.mjs.map
