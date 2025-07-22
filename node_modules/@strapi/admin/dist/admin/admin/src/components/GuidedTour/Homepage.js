'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var Tracking = require('../../features/Tracking.js');
var constants = require('./constants.js');
var Ornaments = require('./Ornaments.js');
var Provider = require('./Provider.js');

const GuidedTourHomepage = ()=>{
    const guidedTourState = Provider.useGuidedTour('GuidedTourHomepage', (state)=>state.guidedTourState);
    const setSkipped = Provider.useGuidedTour('GuidedTourHomepage', (state)=>state.setSkipped);
    const { formatMessage } = reactIntl.useIntl();
    const { trackUsage } = Tracking.useTracking();
    const sections = Object.entries(constants.LAYOUT_DATA).map(([key, val])=>({
            key: key,
            title: val.home.title,
            content: /*#__PURE__*/ jsxRuntime.jsx(designSystem.LinkButton, {
                onClick: ()=>trackUsage(val.home.trackingEvent),
                tag: reactRouterDom.NavLink,
                to: val.home.cta.target,
                endIcon: /*#__PURE__*/ jsxRuntime.jsx(icons.ArrowRight, {}),
                children: formatMessage(val.home.cta.title)
            }),
            isDone: Object.values(guidedTourState[key]).every((value)=>value === true)
        }));
    const activeSectionIndex = sections.findIndex((section)=>!section.isDone);
    const handleSkip = ()=>{
        setSkipped(true);
        trackUsage('didSkipGuidedtour');
    };
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
        hasRadius: true,
        shadow: "tableShadow",
        paddingTop: 7,
        paddingRight: 4,
        paddingLeft: 7,
        paddingBottom: 4,
        background: "neutral0",
        children: [
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                direction: "column",
                alignItems: "stretch",
                gap: 6,
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        variant: "beta",
                        tag: "h2",
                        children: formatMessage({
                            id: 'app.components.GuidedTour.title',
                            defaultMessage: '3 steps to get started'
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                        children: sections.map((section, index)=>{
                            const state = getState(activeSectionIndex, index);
                            return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
                                children: [
                                    /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                                        children: [
                                            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                                minWidth: `3rem`,
                                                marginRight: 5,
                                                children: /*#__PURE__*/ jsxRuntime.jsx(Ornaments.Number, {
                                                    state: state,
                                                    children: index + 1
                                                })
                                            }),
                                            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                                variant: "delta",
                                                tag: "h3",
                                                children: formatMessage(section.title)
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                                        alignItems: "flex-start",
                                        children: [
                                            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                                                justifyContent: "center",
                                                minWidth: `3rem`,
                                                marginBottom: 3,
                                                marginTop: 3,
                                                marginRight: 5,
                                                children: index === sections.length - 1 ? null : /*#__PURE__*/ jsxRuntime.jsx(Ornaments.VerticalDivider, {
                                                    state: state
                                                })
                                            }),
                                            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                                marginTop: 2,
                                                children: state === constants.STATES.IS_ACTIVE ? section.content : null
                                            })
                                        ]
                                    })
                                ]
                            }, section.key);
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
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
    });
};
const getState = (activeSectionIndex, index)=>{
    if (activeSectionIndex === -1) {
        return constants.STATES.IS_DONE;
    }
    if (index < activeSectionIndex) {
        return constants.STATES.IS_DONE;
    }
    if (index > activeSectionIndex) {
        return constants.STATES.IS_NOT_DONE;
    }
    return constants.STATES.IS_ACTIVE;
};

exports.GuidedTourHomepage = GuidedTourHomepage;
//# sourceMappingURL=Homepage.js.map
