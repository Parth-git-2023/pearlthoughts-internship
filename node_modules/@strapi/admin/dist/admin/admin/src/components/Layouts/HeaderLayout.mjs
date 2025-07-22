import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { Box, Flex, Typography, useCallbackRef } from '@strapi/design-system';
import { useElementOnScreen } from '../../hooks/useElementOnScreen.mjs';

const BaseHeaderLayout = /*#__PURE__*/ React.forwardRef(({ navigationAction, primaryAction, secondaryAction, subtitle, title, sticky, width, ...props }, ref)=>{
    const isSubtitleString = typeof subtitle === 'string';
    if (sticky) {
        return /*#__PURE__*/ jsx(Box, {
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 3,
            paddingBottom: 3,
            position: "fixed",
            top: 0,
            right: 0,
            background: "neutral0",
            shadow: "tableShadow",
            width: `${width}px`,
            zIndex: 3,
            "data-strapi-header-sticky": true,
            children: /*#__PURE__*/ jsxs(Flex, {
                justifyContent: "space-between",
                children: [
                    /*#__PURE__*/ jsxs(Flex, {
                        children: [
                            navigationAction && /*#__PURE__*/ jsx(Box, {
                                paddingRight: 3,
                                children: navigationAction
                            }),
                            /*#__PURE__*/ jsxs(Box, {
                                children: [
                                    /*#__PURE__*/ jsx(Typography, {
                                        variant: "beta",
                                        tag: "h1",
                                        ...props,
                                        children: title
                                    }),
                                    isSubtitleString ? /*#__PURE__*/ jsx(Typography, {
                                        variant: "pi",
                                        textColor: "neutral600",
                                        children: subtitle
                                    }) : subtitle
                                ]
                            }),
                            secondaryAction ? /*#__PURE__*/ jsx(Box, {
                                paddingLeft: 4,
                                children: secondaryAction
                            }) : null
                        ]
                    }),
                    /*#__PURE__*/ jsx(Flex, {
                        children: primaryAction ? /*#__PURE__*/ jsx(Box, {
                            paddingLeft: 2,
                            children: primaryAction
                        }) : undefined
                    })
                ]
            })
        });
    }
    return /*#__PURE__*/ jsxs(Box, {
        ref: ref,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        paddingTop: navigationAction ? 6 : 8,
        background: "neutral100",
        "data-strapi-header": true,
        children: [
            navigationAction ? /*#__PURE__*/ jsx(Box, {
                paddingBottom: 2,
                children: navigationAction
            }) : null,
            /*#__PURE__*/ jsxs(Flex, {
                justifyContent: "space-between",
                children: [
                    /*#__PURE__*/ jsxs(Flex, {
                        minWidth: 0,
                        children: [
                            /*#__PURE__*/ jsx(Typography, {
                                tag: "h1",
                                variant: "alpha",
                                ...props,
                                children: title
                            }),
                            secondaryAction ? /*#__PURE__*/ jsx(Box, {
                                paddingLeft: 4,
                                children: secondaryAction
                            }) : null
                        ]
                    }),
                    primaryAction
                ]
            }),
            isSubtitleString ? /*#__PURE__*/ jsx(Typography, {
                variant: "epsilon",
                textColor: "neutral600",
                tag: "p",
                children: subtitle
            }) : subtitle
        ]
    });
});
const HeaderLayout = (props)=>{
    const baseHeaderLayoutRef = React.useRef(null);
    const [headerSize, setHeaderSize] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(true);
    const containerRef = useElementOnScreen(setIsVisible, {
        root: null,
        rootMargin: '0px',
        threshold: 0
    });
    useResizeObserver(containerRef, ()=>{
        if (containerRef.current) {
            setHeaderSize(containerRef.current.getBoundingClientRect());
        }
    });
    React.useEffect(()=>{
        if (baseHeaderLayoutRef.current) {
            setHeaderSize(baseHeaderLayoutRef.current.getBoundingClientRect());
        }
    }, [
        baseHeaderLayoutRef
    ]);
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx("div", {
                style: {
                    height: headerSize?.height
                },
                ref: containerRef,
                children: isVisible && /*#__PURE__*/ jsx(BaseHeaderLayout, {
                    ref: baseHeaderLayoutRef,
                    ...props
                })
            }),
            !isVisible && /*#__PURE__*/ jsx(BaseHeaderLayout, {
                ...props,
                sticky: true,
                width: headerSize?.width
            })
        ]
    });
};
HeaderLayout.displayName = 'HeaderLayout';
/**
 * useResizeObserver: hook that observes the size of an element and calls a callback when it changes.
 */ const useResizeObserver = (sources, onResize)=>{
    const handleResize = useCallbackRef(onResize);
    React.useLayoutEffect(()=>{
        const resizeObs = new ResizeObserver(handleResize);
        if (Array.isArray(sources)) {
            sources.forEach((source)=>{
                if (source.current) {
                    resizeObs.observe(source.current);
                }
            });
        } else if (sources.current) {
            resizeObs.observe(sources.current);
        }
        return ()=>{
            resizeObs.disconnect();
        };
    }, [
        sources,
        handleResize
    ]);
};

export { BaseHeaderLayout, HeaderLayout };
//# sourceMappingURL=HeaderLayout.mjs.map
