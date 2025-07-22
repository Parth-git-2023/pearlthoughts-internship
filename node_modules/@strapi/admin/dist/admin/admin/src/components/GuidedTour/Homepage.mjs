import { jsx, jsxs } from 'react/jsx-runtime';
import { LinkButton, Box, Flex, Typography, Button } from '@strapi/design-system';
import { ArrowRight } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useTracking } from '../../features/Tracking.mjs';
import { LAYOUT_DATA, STATES } from './constants.mjs';
import { Number, VerticalDivider } from './Ornaments.mjs';
import { useGuidedTour } from './Provider.mjs';

const GuidedTourHomepage = ()=>{
    const guidedTourState = useGuidedTour('GuidedTourHomepage', (state)=>state.guidedTourState);
    const setSkipped = useGuidedTour('GuidedTourHomepage', (state)=>state.setSkipped);
    const { formatMessage } = useIntl();
    const { trackUsage } = useTracking();
    const sections = Object.entries(LAYOUT_DATA).map(([key, val])=>({
            key: key,
            title: val.home.title,
            content: /*#__PURE__*/ jsx(LinkButton, {
                onClick: ()=>trackUsage(val.home.trackingEvent),
                tag: NavLink,
                to: val.home.cta.target,
                endIcon: /*#__PURE__*/ jsx(ArrowRight, {}),
                children: formatMessage(val.home.cta.title)
            }),
            isDone: Object.values(guidedTourState[key]).every((value)=>value === true)
        }));
    const activeSectionIndex = sections.findIndex((section)=>!section.isDone);
    const handleSkip = ()=>{
        setSkipped(true);
        trackUsage('didSkipGuidedtour');
    };
    return /*#__PURE__*/ jsxs(Box, {
        hasRadius: true,
        shadow: "tableShadow",
        paddingTop: 7,
        paddingRight: 4,
        paddingLeft: 7,
        paddingBottom: 4,
        background: "neutral0",
        children: [
            /*#__PURE__*/ jsxs(Flex, {
                direction: "column",
                alignItems: "stretch",
                gap: 6,
                children: [
                    /*#__PURE__*/ jsx(Typography, {
                        variant: "beta",
                        tag: "h2",
                        children: formatMessage({
                            id: 'app.components.GuidedTour.title',
                            defaultMessage: '3 steps to get started'
                        })
                    }),
                    /*#__PURE__*/ jsx(Box, {
                        children: sections.map((section, index)=>{
                            const state = getState(activeSectionIndex, index);
                            return /*#__PURE__*/ jsxs(Box, {
                                children: [
                                    /*#__PURE__*/ jsxs(Flex, {
                                        children: [
                                            /*#__PURE__*/ jsx(Box, {
                                                minWidth: `3rem`,
                                                marginRight: 5,
                                                children: /*#__PURE__*/ jsx(Number, {
                                                    state: state,
                                                    children: index + 1
                                                })
                                            }),
                                            /*#__PURE__*/ jsx(Typography, {
                                                variant: "delta",
                                                tag: "h3",
                                                children: formatMessage(section.title)
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsxs(Flex, {
                                        alignItems: "flex-start",
                                        children: [
                                            /*#__PURE__*/ jsx(Flex, {
                                                justifyContent: "center",
                                                minWidth: `3rem`,
                                                marginBottom: 3,
                                                marginTop: 3,
                                                marginRight: 5,
                                                children: index === sections.length - 1 ? null : /*#__PURE__*/ jsx(VerticalDivider, {
                                                    state: state
                                                })
                                            }),
                                            /*#__PURE__*/ jsx(Box, {
                                                marginTop: 2,
                                                children: state === STATES.IS_ACTIVE ? section.content : null
                                            })
                                        ]
                                    })
                                ]
                            }, section.key);
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx(Flex, {
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
    });
};
const getState = (activeSectionIndex, index)=>{
    if (activeSectionIndex === -1) {
        return STATES.IS_DONE;
    }
    if (index < activeSectionIndex) {
        return STATES.IS_DONE;
    }
    if (index > activeSectionIndex) {
        return STATES.IS_NOT_DONE;
    }
    return STATES.IS_ACTIVE;
};

export { GuidedTourHomepage };
//# sourceMappingURL=Homepage.mjs.map
