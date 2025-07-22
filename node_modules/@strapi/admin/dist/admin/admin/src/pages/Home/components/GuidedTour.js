'use strict';

var jsxRuntime = require('react/jsx-runtime');
var Homepage = require('../../../components/GuidedTour/Homepage.js');
var Provider = require('../../../components/GuidedTour/Provider.js');

const GuidedTour = ()=>{
    const guidedTourState = Provider.useGuidedTour('HomePage', (state)=>state.guidedTourState);
    const isGuidedTourVisible = Provider.useGuidedTour('HomePage', (state)=>state.isGuidedTourVisible);
    const isSkipped = Provider.useGuidedTour('HomePage', (state)=>state.isSkipped);
    const showGuidedTour = !Object.values(guidedTourState).every((section)=>Object.values(section).every((step)=>step)) && isGuidedTourVisible && !isSkipped;
    if (!showGuidedTour) {
        return null;
    }
    return /*#__PURE__*/ jsxRuntime.jsx(Homepage.GuidedTourHomepage, {});
};

exports.GuidedTour = GuidedTour;
//# sourceMappingURL=GuidedTour.js.map
