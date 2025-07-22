import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import 'react';
import { Typography, Flex, Box, Button, IconButton } from '@strapi/design-system';
import { Duplicate, Key } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { ContentBox } from '../../../../components/ContentBox.mjs';
import { unstableUseGuidedTour } from '../../../../components/UnstableGuidedTour/Context.mjs';
import { tours } from '../../../../components/UnstableGuidedTour/Tours.mjs';
import { useNotification } from '../../../../features/Notifications.mjs';
import { useTracking } from '../../../../features/Tracking.mjs';
import { useClipboard } from '../../../../hooks/useClipboard.mjs';

const TypographyWordBreak = styled(Typography)`
  word-break: break-all;
`;
const UnstableApiTokenBox = ({ token, tokenType })=>{
    const { formatMessage } = useIntl();
    const { toggleNotification } = useNotification();
    const { trackUsage } = useTracking();
    const dispatch = unstableUseGuidedTour('TokenBox', (s)=>s.dispatch);
    const { copy } = useClipboard();
    const handleClick = (token)=>async ()=>{
            if (token) {
                const didCopy = await copy(token);
                if (didCopy) {
                    trackUsage('didCopyTokenKey', {
                        tokenType
                    });
                    dispatch({
                        type: 'set_completed_actions',
                        payload: [
                            'didCopyApiToken'
                        ]
                    });
                    toggleNotification({
                        type: 'success',
                        message: formatMessage({
                            id: 'Settings.tokens.notification.copied'
                        })
                    });
                }
            }
        };
    return /*#__PURE__*/ jsx(Fragment, {
        children: /*#__PURE__*/ jsxs(Flex, {
            shadow: "tableShadow",
            direction: "column",
            alignItems: "start",
            hasRadius: true,
            padding: 6,
            background: "neutral0",
            children: [
                /*#__PURE__*/ jsxs(Flex, {
                    direction: "column",
                    alignItems: "start",
                    gap: 1,
                    paddingBottom: 4,
                    children: [
                        /*#__PURE__*/ jsx(Typography, {
                            fontWeight: "bold",
                            children: formatMessage({
                                id: 'Settings.tokens.copy.title',
                                defaultMessage: 'Token'
                            })
                        }),
                        /*#__PURE__*/ jsx(Typography, {
                            children: formatMessage({
                                id: 'Settings.tokens.copy.lastWarning',
                                defaultMessage: 'Make sure to copy this token, you won’t be able to see it again!'
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ jsx(Box, {
                    background: "neutral100",
                    hasRadius: true,
                    padding: 2,
                    borderColor: "neutral150",
                    children: /*#__PURE__*/ jsx(TypographyWordBreak, {
                        fontWeight: "semiBold",
                        variant: "pi",
                        children: token
                    })
                }),
                /*#__PURE__*/ jsx(tours.apiTokens.CopyAPIToken, {
                    children: /*#__PURE__*/ jsx(Button, {
                        startIcon: /*#__PURE__*/ jsx(Duplicate, {}),
                        variant: "secondary",
                        onClick: handleClick(token),
                        marginTop: 6,
                        children: formatMessage({
                            id: 'Settings.tokens.copy.copy',
                            defaultMessage: 'Copy'
                        })
                    })
                })
            ]
        })
    });
};
const TokenBox = ({ token, tokenType })=>{
    const { formatMessage } = useIntl();
    const { toggleNotification } = useNotification();
    const { trackUsage } = useTracking();
    const { copy } = useClipboard();
    const handleClick = (token)=>async ()=>{
            if (token) {
                const didCopy = await copy(token);
                if (didCopy) {
                    trackUsage('didCopyTokenKey', {
                        tokenType
                    });
                    toggleNotification({
                        type: 'success',
                        message: formatMessage({
                            id: 'Settings.tokens.notification.copied'
                        })
                    });
                }
            }
        };
    return /*#__PURE__*/ jsx(ContentBox, {
        endAction: token && /*#__PURE__*/ jsx("span", {
            style: {
                alignSelf: 'start'
            },
            children: /*#__PURE__*/ jsx(IconButton, {
                label: formatMessage({
                    id: 'app.component.CopyToClipboard.label',
                    defaultMessage: 'Copy to clipboard'
                }),
                onClick: handleClick(token),
                variant: "ghost",
                type: "button",
                style: {
                    padding: 0,
                    height: '1.6rem'
                },
                children: /*#__PURE__*/ jsx(Duplicate, {})
            })
        }),
        title: token || formatMessage({
            id: 'Settings.tokens.copy.editTitle',
            defaultMessage: 'This token isn’t accessible anymore.'
        }),
        subtitle: token ? formatMessage(tokenType === 'api-token' ? {
            id: 'Settings.tokens.copy.subtitle',
            defaultMessage: 'Copy this token for use elsewhere'
        } : {
            id: 'Settings.tokens.copy.lastWarning',
            defaultMessage: 'Make sure to copy this token, you won’t be able to see it again!'
        }) : formatMessage({
            id: 'Settings.tokens.copy.editMessage',
            defaultMessage: 'For security reasons, you can only see your token once.'
        }),
        icon: /*#__PURE__*/ jsx(Key, {}),
        iconBackground: "neutral100"
    });
};

export { TokenBox, UnstableApiTokenBox };
//# sourceMappingURL=TokenBox.mjs.map
