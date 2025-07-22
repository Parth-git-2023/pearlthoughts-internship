import { jsx } from 'react/jsx-runtime';
import { Flex, Typography, Box } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { STATES } from './constants.mjs';

const Number = ({ children, state, ...props })=>{
    return state === STATES.IS_DONE || state === STATES.IS_ACTIVE ? /*#__PURE__*/ jsx(Flex, {
        background: "primary600",
        padding: 2,
        borderRadius: "50%",
        width: `3rem`,
        height: `3rem`,
        justifyContent: "center",
        ...props,
        children: state === STATES.IS_DONE ? /*#__PURE__*/ jsx(Check, {
            "aria-hidden": true,
            width: `1.6rem`,
            fill: "neutral0"
        }) : /*#__PURE__*/ jsx(Typography, {
            fontWeight: "semiBold",
            textColor: "neutral0",
            children: children
        })
    }) : /*#__PURE__*/ jsx(Flex, {
        borderColor: "neutral500",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: 2,
        borderRadius: "50%",
        width: `3rem`,
        height: `3rem`,
        justifyContent: "center",
        ...props,
        children: /*#__PURE__*/ jsx(Typography, {
            fontWeight: "semiBold",
            textColor: "neutral600",
            children: children
        })
    });
};
const VerticalDivider = ({ state, ...props })=>/*#__PURE__*/ jsx(Box, {
        width: `0.2rem`,
        height: "100%",
        background: state === STATES.IS_NOT_DONE ? 'neutral300' : 'primary500',
        hasRadius: true,
        minHeight: state === STATES.IS_ACTIVE ? `8.5rem` : `6.5rem`,
        ...props
    });

export { Number, VerticalDivider };
//# sourceMappingURL=Ornaments.mjs.map
