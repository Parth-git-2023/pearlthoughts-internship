'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');
var reactIntl = require('react-intl');
var styled = require('styled-components');
var hooks = require('../core/store/hooks.js');
var reducer = require('../reducer.js');

const Wrapper = styled.styled(designSystem.Box)`
  margin: 0 auto;
  width: 552px;
`;
const Column = styled.styled(designSystem.Flex)`
  flex-direction: column;
`;
const LocaleToggle = ()=>{
    const localeNames = hooks.useTypedSelector((state)=>state.admin_app.language.localeNames);
    const dispatch = hooks.useTypedDispatch();
    const { formatMessage, locale } = reactIntl.useIntl();
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.SingleSelect, {
        "aria-label": formatMessage({
            id: 'global.localeToggle.label',
            defaultMessage: 'Select interface language'
        }),
        value: locale,
        onChange: (language)=>{
            dispatch(reducer.setLocale(language));
        },
        children: Object.entries(localeNames).map(([language, name])=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.SingleSelectOption, {
                value: language,
                children: name
            }, language))
    });
};
const LayoutContent = ({ children })=>/*#__PURE__*/ jsxRuntime.jsx(Wrapper, {
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
    return /*#__PURE__*/ jsxRuntime.jsxs("div", {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                tag: "header",
                justifyContent: "flex-end",
                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    paddingTop: 6,
                    paddingRight: 8,
                    children: /*#__PURE__*/ jsxRuntime.jsx(LocaleToggle, {})
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                paddingTop: 2,
                paddingBottom: 11,
                children: children
            })
        ]
    });
};

exports.Column = Column;
exports.LayoutContent = LayoutContent;
exports.UnauthenticatedLayout = UnauthenticatedLayout;
//# sourceMappingURL=UnauthenticatedLayout.js.map
