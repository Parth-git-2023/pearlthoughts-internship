'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var designSystem = require('@strapi/design-system');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var Context = require('./Context.js');

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

const ActionsContainer = styled.styled(designSystem.Flex)`
  border-top: ${({ theme })=>`1px solid ${theme.colors.neutral150}`};
`;
const createStepComponents = (tourName)=>({
        Root: /*#__PURE__*/ React__namespace.forwardRef((props, ref)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Popover.Content, {
                ref: ref,
                side: "top",
                align: "center",
                style: {
                    border: 'none'
                },
                ...props,
                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                    width: "360px",
                    direction: "column",
                    alignItems: "start",
                    children: props.children
                })
            })),
        Title: (props)=>{
            return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                paddingTop: 5,
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 1,
                width: "100%",
                children: 'children' in props ? props.children : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                    tag: "div",
                    variant: "omega",
                    fontWeight: "bold",
                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                        tagName: "h1",
                        id: props.id,
                        defaultMessage: props.defaultMessage
                    })
                })
            });
        },
        Content: (props)=>/*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                width: "100%",
                children: 'children' in props ? props.children : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                    tag: "div",
                    variant: "omega",
                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                        tagName: "p",
                        id: props.id,
                        defaultMessage: props.defaultMessage
                    })
                })
            }),
        Actions: ({ showStepCount = true, showSkip = false, to, ...props })=>{
            const dispatch = Context.unstableUseGuidedTour('GuidedTourPopover', (s)=>s.dispatch);
            const state = Context.unstableUseGuidedTour('GuidedTourPopover', (s)=>s.state);
            const currentStep = state.tours[tourName].currentStep + 1;
            // TODO: Currently all tours do not count their last step, but we should find a way to make this more smart
            const displayedLength = state.tours[tourName].length - 1;
            return /*#__PURE__*/ jsxRuntime.jsx(ActionsContainer, {
                width: "100%",
                padding: 3,
                paddingLeft: 5,
                children: 'children' in props ? props.children : /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                    flex: 1,
                    justifyContent: showStepCount ? 'space-between' : 'flex-end',
                    children: [
                        showStepCount && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                            variant: "omega",
                            fontSize: "12px",
                            children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                                id: "tours.stepCount",
                                defaultMessage: "Step {currentStep} of {tourLength}",
                                values: {
                                    currentStep,
                                    tourLength: displayedLength
                                }
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                            gap: 2,
                            children: [
                                showSkip && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
                                    variant: "tertiary",
                                    onClick: ()=>dispatch({
                                            type: 'skip_tour',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                                        id: "tours.skip",
                                        defaultMessage: "Skip"
                                    })
                                }),
                                to ? /*#__PURE__*/ jsxRuntime.jsx(designSystem.LinkButton, {
                                    tag: reactRouterDom.NavLink,
                                    to: to,
                                    onClick: ()=>dispatch({
                                            type: 'next_step',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                                        id: "tours.next",
                                        defaultMessage: "Next"
                                    })
                                }) : /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
                                    onClick: ()=>dispatch({
                                            type: 'next_step',
                                            payload: tourName
                                        }),
                                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
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

exports.createStepComponents = createStepComponents;
//# sourceMappingURL=Step.js.map
