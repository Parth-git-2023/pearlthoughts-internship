'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var immer = require('immer');
var usePersistentState = require('../../hooks/usePersistentState.js');
var Context = require('../Context.js');
var Tours = require('./Tours.js');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

const [GuidedTourProviderImpl, unstableUseGuidedTour] = Context.createContext('UnstableGuidedTour');
function reducer(state, action) {
    return immer.produce(state, (draft)=>{
        if (action.type === 'next_step') {
            const nextStep = draft.tours[action.payload].currentStep + 1;
            draft.tours[action.payload].currentStep = nextStep;
            draft.tours[action.payload].isCompleted = nextStep === draft.tours[action.payload].length;
        }
        if (action.type === 'skip_tour') {
            draft.tours[action.payload].isCompleted = true;
        }
        if (action.type === 'set_completed_actions') {
            draft.completedActions = [
                ...new Set([
                    ...draft.completedActions,
                    ...action.payload
                ])
            ];
        }
        if (action.type === 'skip_all_tours') {
            draft.enabled = false;
        }
    });
}
const STORAGE_KEY = 'STRAPI_GUIDED_TOUR';
const UnstableGuidedTourContext = ({ children, enabled = true })=>{
    const initialTourState = Object.keys(Tours.tours).reduce((acc, tourName)=>{
        const tourLength = Object.keys(Tours.tours[tourName]).length;
        acc[tourName] = {
            currentStep: 0,
            length: tourLength,
            isCompleted: false
        };
        return acc;
    }, {});
    const [tours, setTours] = usePersistentState.usePersistentState(STORAGE_KEY, {
        tours: initialTourState,
        enabled,
        completedActions: []
    });
    const [state, dispatch] = React__namespace.useReducer(reducer, tours);
    // Sync local storage
    React__namespace.useEffect(()=>{
        if (window.strapi.future.isEnabled('unstableGuidedTour')) {
            setTours(state);
        }
    }, [
        state,
        setTours
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx(GuidedTourProviderImpl, {
        state: state,
        dispatch: dispatch,
        children: children
    });
};

exports.UnstableGuidedTourContext = UnstableGuidedTourContext;
exports.reducer = reducer;
exports.unstableUseGuidedTour = unstableUseGuidedTour;
//# sourceMappingURL=Context.js.map
