'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var get = require('lodash/get');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var Tracking = require('../../features/Tracking.js');
var constants = require('./constants.js');
var Ornaments = require('./Ornaments.js');
var Provider = require('./Provider.js');

/* -------------------------------------------------------------------------------------------------
 * GuidedTourModal
 * -----------------------------------------------------------------------------------------------*/ const GuidedTourModal = ()=>{
    const guidedTour = Provider.useGuidedTour('GuidedTourModal', (state)=>state);
    const { currentStep, guidedTourState, setCurrentStep, setStepState, isGuidedTourVisible, setSkipped } = guidedTour;
    const { formatMessage } = reactIntl.useIntl();
    const { trackUsage } = Tracking.useTracking();
    if (!currentStep || !isGuidedTourVisible) {
        return null;
    }
    const stepData = get(constants.LAYOUT_DATA, currentStep);
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
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Portal, {
        children: /*#__PURE__*/ jsxRuntime.jsx(ModalWrapper, {
            onClick: handleCtaClick,
            padding: 8,
            justifyContent: "center",
            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.FocusTrap, {
                onEscape: handleCtaClick,
                children: /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
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
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                            justifyContent: "flex-end",
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.IconButton, {
                                onClick: handleCtaClick,
                                withTooltip: false,
                                label: formatMessage({
                                    id: 'app.utils.close-label',
                                    defaultMessage: 'Close'
                                }),
                                children: /*#__PURE__*/ jsxRuntime.jsx(icons.Cross, {})
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                            paddingLeft: 7,
                            paddingRight: 7,
                            paddingBottom: !hasStepAfter && !hasSectionAfter ? 8 : 0,
                            children: /*#__PURE__*/ jsxRuntime.jsx(GuidedTourStepper, {
                                title: stepData && 'title' in stepData ? stepData.title : undefined,
                                cta: stepData && 'cta' in stepData ? stepData.cta : undefined,
                                onCtaClick: handleCtaClick,
                                sectionIndex: sectionIndex,
                                stepIndex: stepIndex,
                                hasSectionAfter: hasSectionAfter,
                                children: stepData && 'content' in stepData && /*#__PURE__*/ jsxRuntime.jsx(GuidedTourContent, {
                                    ...stepData.content
                                })
                            })
                        }),
                        !(!hasStepAfter && !hasSectionAfter) && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                            justifyContent: "flex-end",
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
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
const ModalWrapper = styled.styled(designSystem.Flex)`
  position: fixed;
  z-index: 4;
  inset: 0;
  /* this is theme.colors.neutral800 with opacity */
  background: ${({ theme })=>`${theme.colors.neutral800}1F`};
`;
const GuidedTourStepper = ({ title, children, cta, onCtaClick, sectionIndex, stepIndex, hasSectionAfter })=>{
    const { formatMessage } = reactIntl.useIntl();
    const hasSectionBefore = sectionIndex > 0;
    const hasStepsBefore = stepIndex > 0;
    const nextSectionIndex = sectionIndex + 1;
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                alignItems: "stretch",
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        marginRight: 8,
                        justifyContent: "center",
                        minWidth: `3rem`,
                        children: hasSectionBefore && /*#__PURE__*/ jsxRuntime.jsx(Ornaments.VerticalDivider, {
                            state: constants.STATES.IS_DONE,
                            minHeight: `2.4rem`
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "sigma",
                        textColor: "primary600",
                        children: formatMessage({
                            id: 'app.components.GuidedTour.title',
                            defaultMessage: '3 steps to get started'
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        marginRight: 8,
                        minWidth: `3rem`,
                        children: /*#__PURE__*/ jsxRuntime.jsx(Ornaments.Number, {
                            state: hasStepsBefore ? constants.STATES.IS_DONE : constants.STATES.IS_ACTIVE,
                            paddingTop: 3,
                            paddingBottom: 3,
                            children: sectionIndex + 1
                        })
                    }),
                    title && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "alpha",
                        fontWeight: "bold",
                        textColor: "neutral800",
                        tag: "h3",
                        id: "title",
                        children: formatMessage(title)
                    })
                ]
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                alignItems: "stretch",
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        marginRight: 8,
                        direction: "column",
                        justifyContent: "center",
                        minWidth: `3rem`,
                        children: hasSectionAfter && /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                            children: [
                                /*#__PURE__*/ jsxRuntime.jsx(Ornaments.VerticalDivider, {
                                    state: constants.STATES.IS_DONE
                                }),
                                hasStepsBefore && /*#__PURE__*/ jsxRuntime.jsx(Ornaments.Number, {
                                    state: constants.STATES.IS_ACTIVE,
                                    paddingTop: 3,
                                    children: nextSectionIndex + 1
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                        children: [
                            children,
                            cta && (cta.target ? /*#__PURE__*/ jsxRuntime.jsx(designSystem.LinkButton, {
                                tag: reactRouterDom.NavLink,
                                endIcon: /*#__PURE__*/ jsxRuntime.jsx(icons.ArrowRight, {}),
                                onClick: onCtaClick,
                                to: cta.target,
                                children: formatMessage(cta.title)
                            }) : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
                                endIcon: /*#__PURE__*/ jsxRuntime.jsx(icons.ArrowRight, {}),
                                onClick: onCtaClick,
                                children: formatMessage(cta.title)
                            }))
                        ]
                    })
                ]
            }),
            hasStepsBefore && hasSectionAfter && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                paddingTop: 3,
                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                    marginRight: 8,
                    justifyContent: "center",
                    width: `3rem`,
                    children: /*#__PURE__*/ jsxRuntime.jsx(Ornaments.VerticalDivider, {
                        state: constants.STATES.IS_DONE,
                        minHeight: `2.4rem`
                    })
                })
            })
        ]
    });
};
const GuidedTourContent = ({ id, defaultMessage })=>{
    const { formatMessage } = reactIntl.useIntl();
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
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
const DocumentationLink = (children)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
        tag: "a",
        textColor: "primary600",
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html#api-parameters",
        children: children
    });
const Bold = (children)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
        fontWeight: "semiBold",
        children: children
    });
const Paragraph = (children)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
        children: children
    });
const Light = (children)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
        textColor: "neutral600",
        children: children
    });
const List = (children)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        paddingLeft: 6,
        children: /*#__PURE__*/ jsxRuntime.jsx("ul", {
            children: children
        })
    });
const LiStyled = styled.styled.li`
  list-style: disc;
  &::marker {
    color: ${({ theme })=>theme.colors.neutral800};
  }
`;
const ListItem = (children)=>/*#__PURE__*/ jsxRuntime.jsx(LiStyled, {
        children: children
    });

exports.GuidedTourModal = GuidedTourModal;
//# sourceMappingURL=Modal.js.map
