import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { Flex, Popover, Box, Typography, Button, LinkButton } from '@strapi/design-system';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { unstableUseGuidedTour } from './Context.mjs';

const ActionsContainer = styled(Flex)`
  border-top: ${({ theme })=>`1px solid ${theme.colors.neutral150}`};
`;
const createStepComponents = (tourName)=>({
        Root: /*#__PURE__*/ React.forwardRef((props, ref)=>/*#__PURE__*/ jsx(Popover.Content, {
                ref: ref,
                side: "top",
                align: "center",
                style: {
                    border: 'none'
                },
                ...props,
                children: /*#__PURE__*/ jsx(Flex, {
                    width: "360px",
                    direction: "column",
                    alignItems: "start",
                    children: props.children
                })
            })),
        Title: (props)=>{
            return /*#__PURE__*/ jsx(Box, {
                paddingTop: 5,
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 1,
                width: "100%",
                children: 'children' in props ? props.children : /*#__PURE__*/ jsx(Typography, {
                    tag: "div",
                    variant: "omega",
                    fontWeight: "bold",
                    children: /*#__PURE__*/ jsx(FormattedMessage, {
                        tagName: "h1",
                        id: props.id,
                        defaultMessage: props.defaultMessage
                    })
                })
            });
        },
        Content: (props)=>/*#__PURE__*/ jsx(Box, {
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                width: "100%",
                children: 'children' in props ? props.children : /*#__PURE__*/ jsx(Typography, {
                    tag: "div",
                    variant: "omega",
                    children: /*#__PURE__*/ jsx(FormattedMessage, {
                        tagName: "p",
                        id: props.id,
                        defaultMessage: props.defaultMessage
                    })
                })
            }),
        Actions: ({ showStepCount = true, showSkip = false, to, ...props })=>{
            const dispatch = unstableUseGuidedTour('GuidedTourPopover', (s)=>s.dispatch);
            const state = unstableUseGuidedTour('GuidedTourPopover', (s)=>s.state);
            const currentStep = state.tours[tourName].currentStep + 1;
            // TODO: Currently all tours do not count their last step, but we should find a way to make this more smart
            const displayedLength = state.tours[tourName].length - 1;
            return /*#__PURE__*/ jsx(ActionsContainer, {
                width: "100%",
                padding: 3,
                paddingLeft: 5,
                children: 'children' in props ? props.children : /*#__PURE__*/ jsxs(Flex, {
                    flex: 1,
                    justifyContent: showStepCount ? 'space-between' : 'flex-end',
                    children: [
                        showStepCount && /*#__PURE__*/ jsx(Typography, {
                            variant: "omega",
                            fontSize: "12px",
                            children: /*#__PURE__*/ jsx(FormattedMessage, {
                                id: "tours.stepCount",
                                defaultMessage: "Step {currentStep} of {tourLength}",
                                values: {
                                    currentStep,
                                    tourLength: displayedLength
                                }
                            })
                        }),
                        /*#__PURE__*/ jsxs(Flex, {
                            gap: 2,
                            children: [
                                showSkip && /*#__PURE__*/ jsx(Button, {
                                    variant: "tertiary",
                                    onClick: ()=>dispatch({
                                            type: 'skip_tour',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsx(FormattedMessage, {
                                        id: "tours.skip",
                                        defaultMessage: "Skip"
                                    })
                                }),
                                to ? /*#__PURE__*/ jsx(LinkButton, {
                                    tag: NavLink,
                                    to: to,
                                    onClick: ()=>dispatch({
                                            type: 'next_step',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsx(FormattedMessage, {
                                        id: "tours.next",
                                        defaultMessage: "Next"
                                    })
                                }) : /*#__PURE__*/ jsx(Button, {
                                    onClick: ()=>dispatch({
                                            type: 'next_step',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsx(FormattedMessage, {
                                        id: "tours.next",
                                        defaultMessage: "Next"
                                    })
                                })
                            ]
                        })
                    ]
                })
            });
        }
    });

export { createStepComponents };
//# sourceMappingURL=Step.mjs.map
