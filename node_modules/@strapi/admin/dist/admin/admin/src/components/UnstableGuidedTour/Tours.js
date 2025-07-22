'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var designSystem = require('@strapi/design-system');
var reactIntl = require('react-intl');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var admin = require('../../services/admin.js');
var Context = require('./Context.js');
var Step = require('./Step.js');

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

/* -------------------------------------------------------------------------------------------------
 * Tours
 * -----------------------------------------------------------------------------------------------*/ const tours = {
    contentTypeBuilder: createTour('contentTypeBuilder', [
        {
            name: 'Introduction',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "bottom",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentTypeBuilder.Introduction.title",
                            defaultMessage: "Content-Type Builder"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentTypeBuilder.Introduction.content",
                            defaultMessage: "Create and manage your content structure with collection types, single types and components."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showSkip: true
                        })
                    ]
                })
        },
        {
            name: 'CollectionTypes',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    sideOffset: 26,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentTypeBuilder.CollectionTypes.title",
                            defaultMessage: "Collection Types"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentTypeBuilder.CollectionTypes.content",
                            defaultMessage: "Create and manage your content structure with collection types, single types and components."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'SingleTypes',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    sideOffset: 26,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentTypeBuilder.SingleTypes.title",
                            defaultMessage: "Single Types"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentTypeBuilder.SingleTypes.content",
                            defaultMessage: "A content structure that can manage a single entry, such as a homepage or a header."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'Components',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    sideOffset: 26,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentTypeBuilder.Components.title",
                            defaultMessage: "Components"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentTypeBuilder.Components.content",
                            defaultMessage: "A reusable content structure that can be used across multiple content types, such as buttons, sliders or cards."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'Finish',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    sideOffset: 32,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentTypeBuilder.Finish.title",
                            defaultMessage: "It’s time to create content!"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentTypeBuilder.Finish.content",
                            defaultMessage: "Now that you created content types, you’ll be able to create content in the content manager."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showStepCount: false,
                            to: "/content-manager"
                        })
                    ]
                }),
            when: (completedActions)=>completedActions.includes('didCreateContentTypeSchema')
        }
    ]),
    contentManager: createTour('contentManager', [
        {
            name: 'Introduction',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "top",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentManager.Introduction.title",
                            defaultMessage: "Content manager"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentManager.Introduction.content",
                            defaultMessage: "Create and manage content from your collection types and single types."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showSkip: true
                        })
                    ]
                })
        },
        {
            name: 'Fields',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: 'top',
                    align: "start",
                    sideOffset: -36,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentManager.Fields.title",
                            defaultMessage: "Fields"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentManager.Fields.content",
                            defaultMessage: "Add content to the fields created in the Content-Type Builder."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'Publish',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "left",
                    align: "center",
                    sideOffset: 20,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentManager.Publish.title",
                            defaultMessage: "Publish"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentManager.Publish.content",
                            defaultMessage: "Publish entries to make their content available through the Document Service API."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'Finish',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    sideOffset: 32,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.contentManager.FinalStep.title",
                            defaultMessage: "It’s time to create API Tokens!"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.contentManager.FinalStep.content",
                            defaultMessage: "Now that you’ve created and published content, time to create API tokens and set up permissions."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showStepCount: false,
                            to: "/settings/api-tokens"
                        })
                    ]
                }),
            when: (completedActions)=>completedActions.includes('didCreateContent')
        }
    ]),
    apiTokens: createTour('apiTokens', [
        {
            name: 'Introduction',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    sideOffset: -36,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.apiTokens.Introduction.title",
                            defaultMessage: "API tokens"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.apiTokens.Introduction.content",
                            defaultMessage: "Create and manage API tokens with highly customizable permissions."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showSkip: true
                        })
                    ]
                }),
            when: (completedActions)=>!completedActions.includes('didCreateApiToken')
        },
        {
            name: 'CreateAnAPIToken',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "bottom",
                    sideOffset: 20,
                    align: "end",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.apiTokens.CreateAnAPIToken.title",
                            defaultMessage: "Create an API token"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.apiTokens.CreateAnAPIToken.content",
                            defaultMessage: "Create a new API token. Choose a name, duration and type."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                })
        },
        {
            name: 'CopyAPIToken',
            content: (Step)=>/*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "bottom",
                    align: "start",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.apiTokens.CopyAPIToken.title",
                            defaultMessage: "Copy your new API token"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.apiTokens.CopyAPIToken.content",
                            defaultMessage: "Make sure to do it now, you won’t be able to see it again. You’ll need to generate a new one if you lose it."
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {})
                    ]
                }),
            when: (completedActions)=>completedActions.includes('didCreateApiToken')
        },
        {
            name: 'Finish',
            content: (Step)=>{
                const dispatch = Context.unstableUseGuidedTour('GuidedTourPopover', (s)=>s.dispatch);
                return /*#__PURE__*/ jsxRuntime.jsxs(Step.Root, {
                    side: "right",
                    align: "start",
                    sideOffset: 32,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Title, {
                            id: "tours.apiTokens.FinalStep.title",
                            defaultMessage: "It’s time to deploy your application!"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Content, {
                            id: "tours.apiTokens.FinalStep.content",
                            defaultMessage: "Your application is ready to be deployed and its content to be shared with the world!"
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(Step.Actions, {
                            showStepCount: false,
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                                justifyContent: "end",
                                width: '100%',
                                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.LinkButton, {
                                    onClick: ()=>{
                                        dispatch({
                                            type: 'next_step',
                                            payload: 'apiTokens'
                                        });
                                    },
                                    tag: reactRouterDom.NavLink,
                                    to: "/",
                                    children: /*#__PURE__*/ jsxRuntime.jsx(reactIntl.FormattedMessage, {
                                        id: "tours.gotIt",
                                        defaultMessage: "Got it"
                                    })
                                })
                            })
                        })
                    ]
                });
            },
            when: (completedActions)=>completedActions.includes('didCopyApiToken')
        }
    ]),
    strapiCloud: createTour('strapiCloud', [])
};
const UnstableGuidedTourTooltip = ({ children, ...props })=>{
    const state = Context.unstableUseGuidedTour('TooltipWrapper', (s)=>s.state);
    const hasFutureFlag = window.strapi.future.isEnabled('unstableGuidedTour');
    if (!state.enabled) {
        return /*#__PURE__*/ jsxRuntime.jsx(jsxRuntime.Fragment, {
            children: children
        });
    }
    if (!hasFutureFlag) {
        return /*#__PURE__*/ jsxRuntime.jsx(jsxRuntime.Fragment, {
            children: children
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsx(GuidedTourTooltipImpl, {
        ...props,
        children: children
    });
};
const GuidedTourOverlay = styled.styled(designSystem.Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(50, 50, 77, 0.2);
  z-index: 10;
`;
const GuidedTourTooltipImpl = ({ children, content, tourName, step, when })=>{
    const { data: guidedTourMeta } = admin.useGetGuidedTourMetaQuery();
    const state = Context.unstableUseGuidedTour('UnstableGuidedTourTooltip', (s)=>s.state);
    const dispatch = Context.unstableUseGuidedTour('UnstableGuidedTourTooltip', (s)=>s.dispatch);
    const isCurrentStep = state.tours[tourName].currentStep === step;
    const isStepConditionMet = when ? when(state.completedActions) : true;
    const isPopoverOpen = guidedTourMeta?.data?.isFirstSuperAdminUser && !state.tours[tourName].isCompleted && isCurrentStep && isStepConditionMet;
    // Lock the scroll
    React__namespace.useEffect(()=>{
        if (!isPopoverOpen) return;
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return ()=>{
            document.body.style.overflow = originalStyle;
        };
    }, [
        isPopoverOpen
    ]);
    // TODO: This isn't great but the only solution for syncing the completed actions
    React__namespace.useEffect(()=>{
        dispatch({
            type: 'set_completed_actions',
            payload: guidedTourMeta?.data?.completedActions ?? []
        });
    }, [
        dispatch,
        guidedTourMeta?.data?.completedActions
    ]);
    const Step$1 = React__namespace.useMemo(()=>Step.createStepComponents(tourName), [
        tourName
    ]);
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            isPopoverOpen && /*#__PURE__*/ jsxRuntime.jsx(designSystem.Portal, {
                children: /*#__PURE__*/ jsxRuntime.jsx(GuidedTourOverlay, {})
            }),
            /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Popover.Root, {
                open: isPopoverOpen,
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Popover.Anchor, {
                        children: children
                    }),
                    content(Step$1, {
                        state,
                        dispatch
                    })
                ]
            })
        ]
    });
};
function createTour(tourName, steps) {
    const tour = steps.reduce((acc, step, index)=>{
        if (step.name in acc) {
            throw Error(`The tour: ${tourName} with step: ${step.name} has already been registered`);
        }
        acc[step.name] = ({ children })=>{
            return /*#__PURE__*/ jsxRuntime.jsx(UnstableGuidedTourTooltip, {
                tourName: tourName,
                step: index,
                content: step.content,
                when: step.when,
                children: children
            });
        };
        return acc;
    }, {});
    return tour;
}

exports.tours = tours;
//# sourceMappingURL=Tours.js.map
