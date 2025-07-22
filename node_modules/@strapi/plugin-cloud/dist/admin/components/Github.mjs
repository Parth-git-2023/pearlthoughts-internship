import { jsx, jsxs } from 'react/jsx-runtime';
import { Box, LinkButton, Flex, Typography } from '@strapi/design-system';
import { GitHub } from '@strapi/icons/symbols';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { getTrad } from '../utils/getTrad.mjs';
import { LinkIcon } from './Icons/LinkIcon.mjs';

const EmptyStateIconWrapper = styled(Box)`
  svg {
    height: 8.8rem;
  }
`;
const CustomGithubButton = styled(LinkButton)`
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
    const { formatMessage } = useIntl();
    return /*#__PURE__*/ jsx(Box, {
        padding: 4,
        children: /*#__PURE__*/ jsxs(Flex, {
            alignItems: "center",
            direction: "column",
            padding: 11,
            children: [
                /*#__PURE__*/ jsx(EmptyStateIconWrapper, {
                    paddingBottom: 6,
                    "aria-hidden": true,
                    children: /*#__PURE__*/ jsx(LinkIcon, {})
                }),
                /*#__PURE__*/ jsx(Box, {
                    paddingBottom: 4,
                    children: /*#__PURE__*/ jsx(Typography, {
                        variant: "beta",
                        tag: "p",
                        textAlign: "center",
                        textColor: "neutral1000",
                        children: formatMessage({
                            id: getTrad('Homepage.githubBox.title.not-versioned'),
                            defaultMessage: 'Push your project on GitHub'
                        })
                    })
                }),
                /*#__PURE__*/ jsx(Typography, {
                    variant: "epsilon",
                    tag: "p",
                    textAlign: "center",
                    textColor: "neutral600",
                    children: formatMessage({
                        id: getTrad('Homepage.githubBox.subTitle.not-versioned'),
                        defaultMessage: 'Your project has to be versioned on GitHub before deploying on Strapi Cloud.'
                    })
                }),
                /*#__PURE__*/ jsx(Box, {
                    marginTop: 4,
                    children: /*#__PURE__*/ jsx(CustomGithubButton, {
                        isExternal: true,
                        startIcon: /*#__PURE__*/ jsx(GitHub, {}),
                        href: "https://github.com/new",
                        target: "_blank",
                        children: formatMessage({
                            id: getTrad('Homepage.githubBox.buttonText'),
                            defaultMessage: 'Upload to GitHub'
                        })
                    })
                })
            ]
        })
    });
};

export { GithubBox };
//# sourceMappingURL=Github.mjs.map
