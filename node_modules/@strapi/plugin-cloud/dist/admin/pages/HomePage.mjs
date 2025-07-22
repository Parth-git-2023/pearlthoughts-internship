import { jsxs, jsx } from 'react/jsx-runtime';
import { Box, Flex, Typography, Link } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { CloudBox } from '../components/Cloud.mjs';
import { GithubBox } from '../components/Github.mjs';
import { getTrad } from '../utils/getTrad.mjs';
import img$2 from './assets/corner-ornament.svg.mjs';
import img$1 from './assets/left-side-cloud.png.mjs';
import img from './assets/right-side-cloud.png.mjs';

const LogoContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;

  img {
    width: 15rem;
  }
`;
const RightSideCloudContainer = styled(Box)`
  position: absolute;
  top: 400px;
  right: 0;

  img {
    width: 15rem;
  }
`;
const LeftSideCloudContainer = styled(Box)`
  position: absolute;
  top: 150px;
  left: 56px;

  img {
    width: 15rem;
  }
`;
const HomePage = ()=>{
    const { formatMessage } = useIntl();
    return /*#__PURE__*/ jsxs(Box, {
        paddingLeft: 10,
        paddingRight: 10,
        children: [
            /*#__PURE__*/ jsx(RightSideCloudContainer, {
                children: /*#__PURE__*/ jsx("img", {
                    alt: "right-side-cloud",
                    "aria-hidden": true,
                    src: img
                })
            }),
            /*#__PURE__*/ jsx(LeftSideCloudContainer, {
                children: /*#__PURE__*/ jsx("img", {
                    alt: "left-side-cloud",
                    "aria-hidden": true,
                    src: img$1
                })
            }),
            /*#__PURE__*/ jsx(LogoContainer, {
                children: /*#__PURE__*/ jsx("img", {
                    alt: "strapi-corner-ornament",
                    "aria-hidden": true,
                    src: img$2
                })
            }),
            /*#__PURE__*/ jsxs(Box, {
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 8,
                paddingTop: 10,
                children: [
                    /*#__PURE__*/ jsx(Flex, {
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "column",
                        children: /*#__PURE__*/ jsx(Flex, {
                            minWidth: 0,
                            children: /*#__PURE__*/ jsx(Typography, {
                                tag: "h1",
                                variant: "alpha",
                                children: formatMessage({
                                    id: getTrad('Homepage.title'),
                                    defaultMessage: 'Fully-managed Cloud Hosting for your Strapi Project'
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx(Flex, {
                        alignItems: "center",
                        direction: "column",
                        children: /*#__PURE__*/ jsx(Typography, {
                            variant: "epsilon",
                            textColor: "neutral600",
                            tag: "p",
                            children: formatMessage({
                                id: getTrad('Homepage.subTitle'),
                                defaultMessage: 'Follow this 2 steps process to get Everything You Need to Run Strapi in Production.'
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsxs(Box, {
                padding: 10,
                children: [
                    /*#__PURE__*/ jsxs(Layouts.Grid, {
                        size: "M",
                        children: [
                            /*#__PURE__*/ jsx(GithubBox, {}),
                            /*#__PURE__*/ jsx(CloudBox, {})
                        ]
                    }),
                    /*#__PURE__*/ jsxs(Box, {
                        padding: 6,
                        borderRadius: 8,
                        hasRadius: true,
                        background: "neutral0",
                        borderColor: "neutral200",
                        children: [
                            /*#__PURE__*/ jsx(Box, {
                                paddingBottom: 2,
                                children: /*#__PURE__*/ jsx(Typography, {
                                    variant: "delta",
                                    fontWeight: "bold",
                                    textColor: "neutral1000",
                                    tag: "p",
                                    children: formatMessage({
                                        id: getTrad('Homepage.textBox.label.versioned'),
                                        defaultMessage: 'Try Strapi Cloud for Free!'
                                    })
                                })
                            }),
                            /*#__PURE__*/ jsxs(Typography, {
                                variant: "epsilon",
                                textColor: "neutral1000",
                                tag: "p",
                                children: [
                                    formatMessage({
                                        id: getTrad('Homepage.textBox.text.versioned'),
                                        defaultMessage: 'Strapi Cloud offers a 14 days free trial for you to experiment with your project on the cloud including all features.'
                                    }),
                                    ' ',
                                    /*#__PURE__*/ jsx(Link, {
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

export { HomePage };
//# sourceMappingURL=HomePage.mjs.map
