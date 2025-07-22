'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var styledComponents = require('styled-components');
var getTrad = require('../utils/getTrad.js');
var UploadIcon = require('./Icons/UploadIcon.js');

const EmptyStateIconWrapper = styledComponents.styled(designSystem.Box)`
  svg {
    height: 8.8rem;
  }
`;
const CloudBox = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        padding: 4,
        hasRadius: true,
        children: /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
            alignItems: "center",
            direction: "column",
            padding: 11,
            hasRadius: true,
            children: [
                /*#__PURE__*/ jsxRuntime.jsx(EmptyStateIconWrapper, {
                    paddingBottom: 6,
                    "aria-hidden": true,
                    children: /*#__PURE__*/ jsxRuntime.jsx(UploadIcon.UploadIcon, {})
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    paddingBottom: 4,
                    children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "beta",
                        tag: "p",
                        textAlign: "center",
                        textColor: "neutral1000",
                        children: formatMessage({
                            id: getTrad.getTrad('Homepage.cloudBox.title'),
                            defaultMessage: 'Deploy to Strapi Cloud'
                        })
                    })
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                    variant: "epsilon",
                    tag: "p",
                    textAlign: "center",
                    textColor: "neutral600",
                    children: formatMessage({
                        id: getTrad.getTrad('Homepage.cloudBox.subTitle'),
                        defaultMessage: 'Enjoy a Strapi-optimized stack including database, email provider, and CDN.'
                    })
                }),
                /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                    marginTop: 4,
                    children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.LinkButton, {
                        variant: "default",
                        endIcon: /*#__PURE__*/ jsxRuntime.jsx(icons.ExternalLink, {}),
                        href: "https://cloud.strapi.io/login?utm_campaign=Strapi%20Cloud%20Plugin&utm_source=In-Product&utm_medium=CTA",
                        isExternal: true,
                        target: "_blank",
                        children: formatMessage({
                            id: getTrad.getTrad('Homepage.cloudBox.buttonText'),
                            defaultMessage: 'Deploy to Strapi Cloud'
                        })
                    })
                })
            ]
        })
    });
};

exports.CloudBox = CloudBox;
//# sourceMappingURL=Cloud.js.map
