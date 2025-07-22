'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var admin = require('@strapi/strapi/admin');
var reactIntl = require('react-intl');
var styledComponents = require('styled-components');
var Cloud = require('../components/Cloud.js');
var Github = require('../components/Github.js');
var getTrad = require('../utils/getTrad.js');
var cornerOrnament = require('./assets/corner-ornament.svg.js');
var leftSideCloud = require('./assets/left-side-cloud.png.js');
var rightSideCloud = require('./assets/right-side-cloud.png.js');

const LogoContainer = styledComponents.styled(designSystem.Box)`
  position: absolute;
  top: 0;
  right: 0;

  img {
    width: 15rem;
  }
`;
const RightSideCloudContainer = styledComponents.styled(designSystem.Box)`
  position: absolute;
  top: 400px;
  right: 0;

  img {
    width: 15rem;
  }
`;
const LeftSideCloudContainer = styledComponents.styled(designSystem.Box)`
  position: absolute;
  top: 150px;
  left: 56px;

  img {
    width: 15rem;
  }
`;
const HomePage = ()=>{
    const { formatMessage } = reactIntl.useIntl();
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
        paddingLeft: 10,
        paddingRight: 10,
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(RightSideCloudContainer, {
                children: /*#__PURE__*/ jsxRuntime.jsx("img", {
                    alt: "right-side-cloud",
                    "aria-hidden": true,
                    src: rightSideCloud
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(LeftSideCloudContainer, {
                children: /*#__PURE__*/ jsxRuntime.jsx("img", {
                    alt: "left-side-cloud",
                    "aria-hidden": true,
                    src: leftSideCloud
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(LogoContainer, {
                children: /*#__PURE__*/ jsxRuntime.jsx("img", {
                    alt: "strapi-corner-ornament",
                    "aria-hidden": true,
                    src: cornerOrnament
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 8,
                paddingTop: 10,
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "column",
                        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                            minWidth: 0,
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                tag: "h1",
                                variant: "alpha",
                                children: formatMessage({
                                    id: getTrad.getTrad('Homepage.title'),
                                    defaultMessage: 'Fully-managed Cloud Hosting for your Strapi Project'
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        alignItems: "center",
                        direction: "column",
                        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                            variant: "epsilon",
                            textColor: "neutral600",
                            tag: "p",
                            children: formatMessage({
                                id: getTrad.getTrad('Homepage.subTitle'),
                                defaultMessage: 'Follow this 2 steps process to get Everything You Need to Run Strapi in Production.'
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                padding: 10,
                children: [
                    /*#__PURE__*/ jsxRuntime.jsxs(admin.Layouts.Grid, {
                        size: "M",
                        children: [
                            /*#__PURE__*/ jsxRuntime.jsx(Github.GithubBox, {}),
                            /*#__PURE__*/ jsxRuntime.jsx(Cloud.CloudBox, {})
                        ]
                    }),
                    /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                        padding: 6,
                        borderRadius: 8,
                        hasRadius: true,
                        background: "neutral0",
                        borderColor: "neutral200",
                        children: [
                            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                paddingBottom: 2,
                                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                    variant: "delta",
                                    fontWeight: "bold",
                                    textColor: "neutral1000",
                                    tag: "p",
                                    children: formatMessage({
                                        id: getTrad.getTrad('Homepage.textBox.label.versioned'),
                                        defaultMessage: 'Try Strapi Cloud for Free!'
                                    })
                                })
                            }),
                            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Typography, {
                                variant: "epsilon",
                                textColor: "neutral1000",
                                tag: "p",
                                children: [
                                    formatMessage({
                                        id: getTrad.getTrad('Homepage.textBox.text.versioned'),
                                        defaultMessage: 'Strapi Cloud offers a 14 days free trial for you to experiment with your project on the cloud including all features.'
                                    }),
                                    ' ',
                                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Link, {
                                        href: "https://strapi.io/cloud?utm_campaign=Strapi%20Cloud%20Plugin&utm_source=In-Product&utm_medium=CTA",
                                        children: "Learn more"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};

exports.HomePage = HomePage;
//# sourceMappingURL=HomePage.js.map
