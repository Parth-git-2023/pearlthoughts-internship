import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import 'react';
import { Flex, Portal, FocusTrap, IconButton, Box, Button, Typography, LinkButton } from '@strapi/design-system';
import { Cross, ArrowRight } from '@strapi/icons';
import get from 'lodash/get';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { useTracking } from '../../features/Tracking.mjs';
import { LAYOUT_DATA, STATES } from './constants.mjs';
import { VerticalDivider, Number } from './Ornaments.mjs';
import { useGuidedTour } from './Provider.mjs';

/* -------------------------------------------------------------------------------------------------
 * GuidedTourModal
 * -----------------------------------------------------------------------------------------------*/ const GuidedTourModal = ()=>{
    const guidedTour = useGuidedTour('GuidedTourModal', (state)=>state);
    const { currentStep, guidedTourState, setCurrentStep, setStepState, isGuidedTourVisible, setSkipped } = guidedTour;
    const { formatMessage } = useIntl();
    const { trackUsage } = useTracking();
    if (!currentStep || !isGuidedTourVisible) {
        return null;
    }
    const stepData = get(LAYOUT_DATA, currentStep);
    const sectionKeys = Object.keys(guidedTourState);
    const [sectionName, stepName] = currentStep.split('.');
    const sectionIndex = sectionKeys.indexOf(sectionName);
    const stepIndex = Object.keys(guidedTourState[sectionName]).indexOf(stepName);
    const hasSectionAfter = sectionIndex < sectionKeys.length - 1;
    const hasStepAfter = stepIndex < Object.keys(guidedTourState[sectionName]).length - 1;
    const handleCtaClick = ()=>{
        setStepState(currentStep, true);
        if (stepData) {
            trackUsage(stepData.trackingEvent);
        }
        setCurrentStep(null);
    };
    const handleSkip = ()=>{
        setSkipped(true);
        setCurrentStep(null);
        trackUsage('didSkipGuidedtour');
    };
    return /*#__PURE__*/ jsx(Portal, {
        children: /*#__PURE__*/ jsx(ModalWrapper, {
            onClick: handleCtaClick,
            padding: 8,
            justifyContent: "center",
            children: /*#__PURE__*/ jsx(FocusTrap, {
                onEscape: handleCtaClick,
                children: /*#__PURE__*/ jsxs(Flex, {
                    direction: "column",
                    alignItems: "stretch",
                    background: "neutral0",
                    width: `66rem`,
                    shadow: "popupShadow",
                    hasRadius: true,
                    padding: 4,
                    gap: 8,
                    role: "dialog",
                    "aria-modal": true,
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ jsx(Flex, {
                            justifyContent: "flex-end",
                            children: /*#__PURE__*/ jsx(IconButton, {
                                onClick: handleCtaClick,
                                withTooltip: false,
                                label: formatMessage({
                                    id: 'app.utils.close-label',
                                    defaultMessage: 'Close'
                                }),
                                children: /*#__PURE__*/ jsx(Cross, {})
                            })
                        }),
                        /*#__PURE__*/ jsx(Box, {
                            paddingLeft: 7,
                            paddingRight: 7,
                            paddingBottom: !hasStepAfter && !hasSectionAfter ? 8 : 0,
                            children: /*#__PURE__*/ jsx(GuidedTourStepper, {
                                title: stepData && 'title' in stepData ? stepData.title : undefined,
                                cta: stepData && 'cta' in stepData ? stepData.cta : undefined,
                                onCtaClick: handleCtaClick,
                                sectionIndex: sectionIndex,
                                stepIndex: stepIndex,
                                hasSectionAfter: hasSectionAfter,
                                children: stepData && 'content' in stepData && /*#__PURE__*/ jsx(GuidedTourContent, {
                                    ...stepData.content
                                })
                            })
                        }),
                        !(!hasStepAfter && !hasSectionAfter) && /*#__PURE__*/ jsx(Flex, {
                            justifyContent: "flex-end",
                            children: /*#__PURE__*/ jsx(Button, {
                                variant: "tertiary",
                                onClick: handleSkip,
                                children: formatMessage({
                                    id: 'app.components.GuidedTour.skip',
                                    defaultMessage: 'Skip the tour'
                                })
                            })
                        })
                    ]
                })
            })
        })
    });
};
const ModalWrapper = styled(Flex)`
  position: fixed;
  z-index: 4;
  inset: 0;
  /* this is theme.colors.neutral800 with opacity */
  background: ${({ theme })=>`${theme.colors.neutral800}1F`};
`;
const GuidedTourStepper = ({ title, children, cta, onCtaClick, sectionIndex, stepIndex, hasSectionAfter })=>{
    const { formatMessage } = useIntl();
    const hasSectionBefore = sectionIndex > 0;
    const hasStepsBefore = stepIndex > 0;
    const nextSectionIndex = sectionIndex + 1;
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsxs(Flex, {
                alignItems: "stretch",
                children: [
                    /*#__PURE__*/ jsx(Flex, {
                        marginRight: 8,
                        justifyContent: "center",
                        minWidth: `3rem`,
                        children: hasSectionBefore && /*#__PURE__*/ jsx(VerticalDivider, {
                            state: STATES.IS_DONE,
                            minHeight: `2.4rem`
                        })
                    }),
                    /*#__PURE__*/ jsx(Typography, {
                        variant: "sigma",
                        textColor: "primary600",
                        children: formatMessage({
                            id: 'app.components.GuidedTour.title',
                            defaultMessage: '3 steps to get started'
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsxs(Flex, {
                children: [
                    /*#__PURE__*/ jsx(Flex, {
                        marginRight: 8,
                        minWidth: `3rem`,
                        children: /*#__PURE__*/ jsx(Number, {
                            state: hasStepsBefore ? STATES.IS_DONE : STATES.IS_ACTIVE,
                            paddingTop: 3,
                            paddingBottom: 3,
                            children: sectionIndex + 1
                        })
                    }),
                    title && /*#__PURE__*/ jsx(Typography, {
                        variant: "alpha",
                        fontWeight: "bold",
                        textColor: "neutral800",
                        tag: "h3",
                        id: "title",
                        children: formatMessage(title)
                    })
                ]
            }),
            /*#__PURE__*/ jsxs(Flex, {
                alignItems: "stretch",
                children: [
                    /*#__PURE__*/ jsx(Flex, {
                        marginRight: 8,
                        direction: "column",
                        justifyContent: "center",
                        minWidth: `3rem`,
                        children: hasSectionAfter && /*#__PURE__*/ jsxs(Fragment, {
                            children: [
                                /*#__PURE__*/ jsx(VerticalDivider, {
                                    state: STATES.IS_DONE
                                }),
                                hasStepsBefore && /*#__PURE__*/ jsx(Number, {
                                    state: STATES.IS_ACTIVE,
                                    paddingTop: 3,
                                    children: nextSectionIndex + 1
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsxs(Box, {
                        children: [
                            children,
                            cta && (cta.target ? /*#__PURE__*/ jsx(LinkButton, {
                                tag: NavLink,
                                endIcon: /*#__PURE__*/ jsx(ArrowRight, {}),
                                onClick: onCtaClick,
                                to: cta.target,
                                children: formatMessage(cta.title)
                            }) : /*#__PURE__*/ jsx(Button, {
                                endIcon: /*#__PURE__*/ jsx(ArrowRight, {}),
                                onClick: onCtaClick,
                                children: formatMessage(cta.title)
                            }))
                        ]
                    })
                ]
            }),
            hasStepsBefore && hasSectionAfter && /*#__PURE__*/ jsx(Box, {
                paddingTop: 3,
                children: /*#__PURE__*/ jsx(Flex, {
                    marginRight: 8,
                    justifyContent: "center",
                    width: `3rem`,
                    children: /*#__PURE__*/ jsx(VerticalDivider, {
                        state: STATES.IS_DONE,
                        minHeight: `2.4rem`
                    })
                })
            })
        ]
    });
};
const GuidedTourContent = ({ id, defaultMessage })=>{
    const { formatMessage } = useIntl();
    return /*#__PURE__*/ jsx(Flex, {
        direction: "column",
        alignItems: "stretch",
        gap: 4,
        paddingBottom: 6,
        children: formatMessage({
            id,
            defaultMessage
        }, {
            documentationLink: DocumentationLink,
            b: Bold,
            p: Paragraph,
            light: Light,
            ul: List,
            li: ListItem
        })
    });
};
const DocumentationLink = (children)=>/*#__PURE__*/ jsx(Typography, {
        tag: "a",
        textColor: "primary600",
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html#api-parameters",
        children: children
    });
const Bold = (children)=>/*#__PURE__*/ jsx(Typography, {
        fontWeight: "semiBold",
        children: children
    });
const Paragraph = (children)=>/*#__PURE__*/ jsx(Typography, {
        children: children
    });
const Light = (children)=>/*#__PURE__*/ jsx(Typography, {
        textColor: "neutral600",
        children: children
    });
const List = (children)=>/*#__PURE__*/ jsx(Box, {
        paddingLeft: 6,
        children: /*#__PURE__*/ jsx("ul", {
            children: children
        })
    });
const LiStyled = styled.li`
  list-style: disc;
  &::marker {
    color: ${({ theme })=>theme.colors.neutral800};
  }
`;
const ListItem = (children)=>/*#__PURE__*/ jsx(LiStyled, {
        children: children
    });

export { GuidedTourModal };
//# sourceMappingURL=Modal.mjs.map
