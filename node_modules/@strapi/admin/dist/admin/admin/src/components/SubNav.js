'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var Tours = require('./UnstableGuidedTour/Tours.js');

const Main = styled.styled(designSystem.SubNav)`
  background-color: ${({ theme })=>theme.colors.neutral0};
  border-right: 1px solid ${({ theme })=>theme.colors.neutral150};

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const StyledLink = styled.styled(reactRouterDom.NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  height: 32px;

  color: ${({ theme })=>theme.colors.neutral800};

  &.active > div {
    ${({ theme })=>{
    return `
        background-color: ${theme.colors.primary100};
        color: ${theme.colors.primary700};
        font-weight: 500;
      `;
}}
  }

  &:hover.active > div {
    ${({ theme })=>{
    return `
        background-color: ${theme.colors.primary100};
      `;
}}
  }

  &:hover > div {
    ${({ theme })=>{
    return `
        background-color: ${theme.colors.neutral100};
      `;
}}
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`;
const Link = (props)=>{
    const { label, endAction, ...rest } = props;
    return /*#__PURE__*/ jsxRuntime.jsx(StyledLink, {
        ...rest,
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
            width: '100%',
            paddingLeft: 3,
            paddingRight: 3,
            borderRadius: 1,
            children: /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                justifyContent: "space-between",
                width: "100%",
                gap: 1,
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                        tag: "div",
                        lineHeight: "32px",
                        width: "100%",
                        overflow: "hidden",
                        style: {
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: label
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                        gap: 2,
                        children: endAction
                    })
                ]
            })
        })
    });
};
const StyledHeader = styled.styled(designSystem.Box)`
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: ${({ theme })=>theme.spaces[5]};
`;
const Header = ({ label })=>{
    return /*#__PURE__*/ jsxRuntime.jsx(StyledHeader, {
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
            variant: "beta",
            tag: "h2",
            children: label
        })
    });
};
const Sections = ({ children, ...props })=>{
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
        paddingBottom: 4,
        children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
            tag: "ol",
            gap: "5",
            direction: "column",
            alignItems: "stretch",
            ...props,
            children: children.map((child, index)=>{
                return /*#__PURE__*/ jsxRuntime.jsx("li", {
                    children: child
                }, index);
            })
        })
    });
};
/**
 * TODO:
 * This would be better in the content-type-builder package directly but currently
 * the SubNav API does not expose a way to wrap the link, instead it wraps the link and the list
 */ const getGuidedTourTooltip = (sectionName)=>{
    switch(sectionName){
        case 'Collection Types':
            return Tours.tours.contentTypeBuilder.CollectionTypes;
        case 'Single Types':
            return Tours.tours.contentTypeBuilder.SingleTypes;
        case 'Components':
            return Tours.tours.contentTypeBuilder.Components;
        default:
            return React.Fragment;
    }
};
const Section = ({ label, children, link })=>{
    const listId = React.useId();
    const GuidedTourTooltip = getGuidedTourTooltip(label);
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
        direction: "column",
        alignItems: "stretch",
        gap: 2,
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                paddingLeft: 5,
                paddingRight: 5,
                children: /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Flex, {
                    position: "relative",
                    justifyContent: "space-between",
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                                children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                    variant: "sigma",
                                    textColor: "neutral600",
                                    children: label
                                })
                            })
                        }),
                        link && /*#__PURE__*/ jsxRuntime.jsx(GuidedTourTooltip, {
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.IconButton, {
                                label: link.label,
                                variant: "ghost",
                                withTooltip: true,
                                onClick: link.onClik,
                                size: "XS",
                                children: /*#__PURE__*/ jsxRuntime.jsx(icons.Plus, {})
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                tag: "ol",
                id: listId,
                direction: "column",
                gap: "2px",
                alignItems: 'stretch',
                marginLeft: 2,
                marginRight: 2,
                children: children.map((child, index)=>{
                    return /*#__PURE__*/ jsxRuntime.jsx("li", {
                        children: child
                    }, index);
                })
            })
        ]
    });
};
const SubSectionHeader = styled.styled.button`
  cursor: pointer;
  width: 100%;
  border: none;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;

  height: 32px;

  border-radius: ${({ theme })=>theme.borderRadius};

  padding-left: ${({ theme })=>theme.spaces[3]};
  padding-right: ${({ theme })=>theme.spaces[3]};
  padding-top: ${({ theme })=>theme.spaces[2]};
  padding-bottom: ${({ theme })=>theme.spaces[2]};

  &:hover {
    background-color: ${({ theme })=>theme.colors.neutral100};
  }
`;
const SubSectionLinkWrapper = styled.styled.li`
  ${StyledLink} > div {
    padding-left: 36px;
  }
`;
const SubSection = ({ label, children })=>{
    const [isOpen, setOpenLinks] = React.useState(true);
    const listId = React.useId();
    const handleClick = ()=>{
        setOpenLinks((prev)=>!prev);
    };
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Box, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                justifyContent: "space-between",
                children: /*#__PURE__*/ jsxRuntime.jsxs(SubSectionHeader, {
                    onClick: handleClick,
                    "aria-expanded": isOpen,
                    "aria-controls": listId,
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx(icons.ChevronDown, {
                            "aria-hidden": true,
                            fill: "neutral500",
                            style: {
                                transform: `rotate(${isOpen ? '0deg' : '-90deg'})`,
                                transition: 'transform 0.5s'
                            }
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx(designSystem.Box, {
                            paddingLeft: 2,
                            children: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Typography, {
                                tag: "span",
                                fontWeight: "semiBold",
                                textColor: "neutral800",
                                children: label
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Flex, {
                tag: "ul",
                id: listId,
                direction: "column",
                gap: "2px",
                alignItems: 'stretch',
                style: {
                    maxHeight: isOpen ? '1000px' : 0,
                    overflow: 'hidden',
                    transition: isOpen ? 'max-height 1s ease-in-out' : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)'
                },
                children: children.map((child, index)=>{
                    return /*#__PURE__*/ jsxRuntime.jsx(SubSectionLinkWrapper, {
                        children: child
                    }, index);
                })
            })
        ]
    });
};
const SubNav = {
    Main,
    Header,
    Link,
    Sections,
    Section,
    SubSection
};

exports.SubNav = SubNav;
//# sourceMappingURL=SubNav.js.map
