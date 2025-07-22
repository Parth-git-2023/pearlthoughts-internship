import { jsx, jsxs } from 'react/jsx-runtime';
import { Box, Flex, Typography, LinkButton } from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { getTrad } from '../utils/getTrad.mjs';
import { UploadIcon } from './Icons/UploadIcon.mjs';

const EmptyStateIconWrapper = styled(Box)`
  svg {
    height: 8.8rem;
  }
`;
const CloudBox = ()=>{
    const { formatMessage } = useIntl();
    return /*#__PURE__*/ jsx(Box, {
        padding: 4,
        hasRadius: true,
        children: /*#__PURE__*/ jsxs(Flex, {
            alignItems: "center",
            direction: "column",
            padding: 11,
            hasRadius: true,
            children: [
                /*#__PURE__*/ jsx(EmptyStateIconWrapper, {
                    paddingBottom: 6,
                    "aria-hidden": true,
                    children: /*#__PURE__*/ jsx(UploadIcon, {})
                }),
                /*#__PURE__*/ jsx(Box, {
                    paddingBottom: 4,
                    children: /*#__PURE__*/ jsx(Typography, {
                        variant: "beta",
                        tag: "p",
                        textAlign: "center",
                        textColor: "neutral1000",
                        children: formatMessage({
                            id: getTrad('Homepage.cloudBox.title'),
                            defaultMessage: 'Deploy to Strapi Cloud'
                        })
                    })
                }),
                /*#__PURE__*/ jsx(Typography, {
                    variant: "epsilon",
                    tag: "p",
                    textAlign: "center",
                    textColor: "neutral600",
                    children: formatMessage({
                        id: getTrad('Homepage.cloudBox.subTitle'),
                        defaultMessage: 'Enjoy a Strapi-optimized stack including database, email provider, and CDN.'
                    })
                }),
                /*#__PURE__*/ jsx(Box, {
                    marginTop: 4,
                    children: /*#__PURE__*/ jsx(LinkButton, {
                        variant: "default",
                        endIcon: /*#__PURE__*/ jsx(ExternalLink, {}),
                        href: "https://cloud.strapi.io/login?utm_campaign=Strapi%20Cloud%20Plugin&utm_source=In-Product&utm_medium=CTA",
                        isExternal: true,
                        target: "_blank",
                        children: formatMessage({
                            id: getTrad('Homepage.cloudBox.buttonText'),
                            defaultMessage: 'Deploy to Strapi Cloud'
                        })
                    })
                })
            ]
        })
    });
};

export { CloudBox };
//# sourceMappingURL=Cloud.mjs.map
