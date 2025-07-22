'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var symbols = require('@strapi/icons/symbols');
var reactIntl = require('react-intl');
var styledComponents = require('styled-components');
var getTrad = require('../utils/getTrad.js');
var LinkIcon = require('./Icons/LinkIcon.js');

const EmptyStateIconWrapper = styledComponents.styled(designSystem.Box)`
  svg {
    height: 8.8rem;
  }
`;
const CustomGithubButton = styledComponents.styled(designSystem.LinkButton)`
  background-color: #000000;
  color: #ffffff;
  border: none;

  & svg > path {
    fill: ${({ theme })=>theme.colors.neutral0};
  }

  &:hover {
    background-color: #32324d !important;
    border: none !important;
  }
`;
const GithubBox = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        padding: 4,
        children: /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
            alignItems: "center",
            direction: "column",
            padding: 11,
            children: [
                /*#__PURE__*/ jsxRuntime.jsx(EmptyStateIconWrapper, {
                    paddingBottom: 6,
                    "aria-hidden": true,
                    children: /*#__PURE__*/ jsxRuntime.jsx(LinkIcon.LinkIcon, {})
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    paddingBottom: 4,
                    children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "beta",
                        tag: "p",
                        textAlign: "center",
                        textColor: "neutral1000",
                        children: formatMessage({
                            id: getTrad.getTrad('Homepage.githubBox.title.not-versioned'),
                            defaultMessage: 'Push your project on GitHub'
                        })
                    })
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                    variant: "epsilon",
                    tag: "p",
                    textAlign: "center",
                    textColor: "neutral600",
                    children: formatMessage({
                        id: getTrad.getTrad('Homepage.githubBox.subTitle.not-versioned'),
                        defaultMessage: 'Your project has to be versioned on GitHub before deploying on Strapi Cloud.'
                    })
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    marginTop: 4,
                    children: /*#__PURE__*/ jsxRuntime.jsx(CustomGithubButton, {
                        isExternal: true,
                        startIcon: /*#__PURE__*/ jsxRuntime.jsx(symbols.GitHub, {}),
                        href: "https://github.com/new",
                        target: "_blank",
                        children: formatMessage({
                            id: getTrad.getTrad('Homepage.githubBox.buttonText'),
                            defaultMessage: 'Upload to GitHub'
                        })
                    })
                })
            ]
        })
    });
};

exports.GithubBox = GithubBox;
//# sourceMappingURL=Github.js.map
