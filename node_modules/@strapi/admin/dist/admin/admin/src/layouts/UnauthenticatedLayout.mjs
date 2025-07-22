import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { Box, Flex, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { useTypedSelector, useTypedDispatch } from '../core/store/hooks.mjs';
import { setLocale } from '../reducer.mjs';

const Wrapper = styled(Box)`
  margin: 0 auto;
  width: 552px;
`;
const Column = styled(Flex)`
  flex-direction: column;
`;
const LocaleToggle = ()=>{
    const localeNames = useTypedSelector((state)=>state.admin_app.language.localeNames);
    const dispatch = useTypedDispatch();
    const { formatMessage, locale } = useIntl();
    return /*#__PURE__*/ jsx(SingleSelect, {
        "aria-label": formatMessage({
            id: 'global.localeToggle.label',
            defaultMessage: 'Select interface language'
        }),
        value: locale,
        onChange: (language)=>{
            dispatch(setLocale(language));
        },
        children: Object.entries(localeNames).map(([language, name])=>/*#__PURE__*/ jsx(SingleSelectOption, {
                value: language,
                children: name
            }, language))
    });
};
const LayoutContent = ({ children })=>/*#__PURE__*/ jsx(Wrapper, {
        shadow: "tableShadow",
        hasRadius: true,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 10,
        paddingRight: 10,
        background: "neutral0",
        children: children
    });
const UnauthenticatedLayout = ({ children })=>{
    return /*#__PURE__*/ jsxs("div", {
        children: [
            /*#__PURE__*/ jsx(Flex, {
                tag: "header",
                justifyContent: "flex-end",
                children: /*#__PURE__*/ jsx(Box, {
                    paddingTop: 6,
                    paddingRight: 8,
                    children: /*#__PURE__*/ jsx(LocaleToggle, {})
                })
            }),
            /*#__PURE__*/ jsx(Box, {
                paddingTop: 2,
                paddingBottom: 11,
                children: children
            })
        ]
    });
};

export { Column, LayoutContent, UnauthenticatedLayout };
//# sourceMappingURL=UnauthenticatedLayout.mjs.map
