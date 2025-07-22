import { jsx } from 'react/jsx-runtime';
import { GuidedTourHomepage } from '../../../components/GuidedTour/Homepage.mjs';
import { useGuidedTour } from '../../../components/GuidedTour/Provider.mjs';

const GuidedTour = ()=>{
    const guidedTourState = useGuidedTour('HomePage', (state)=>state.guidedTourState);
    const isGuidedTourVisible = useGuidedTour('HomePage', (state)=>state.isGuidedTourVisible);
    const isSkipped = useGuidedTour('HomePage', (state)=>state.isSkipped);
    const showGuidedTour = !Object.values(guidedTourState).every((section)=>Object.values(section).every((step)=>step)) && isGuidedTourVisible && !isSkipped;
    if (!showGuidedTour) {
        return null;
    }
    return /*#__PURE__*/ jsx(GuidedTourHomepage, {});
};

export { GuidedTour };
//# sourceMappingURL=GuidedTour.mjs.map
