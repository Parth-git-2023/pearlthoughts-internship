import { jsx } from 'react/jsx-runtime';
import 'react';
import { Box } from '@strapi/design-system';

const ContentLayout = ({ children })=>{
    return /*#__PURE__*/ jsx(Box, {
        paddingLeft: 10,
        paddingRight: 10,
        children: children
    });
};

export { ContentLayout };
//# sourceMappingURL=ContentLayout.mjs.map
