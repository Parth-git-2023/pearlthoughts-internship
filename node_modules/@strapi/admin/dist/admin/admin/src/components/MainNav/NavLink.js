'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var designSystem = require('@strapi/design-system');
var reactRouterDom = require('react-router-dom');
var styled = require('styled-components');
var Tours = require('../UnstableGuidedTour/Tours.js');

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
 * Link
 * -----------------------------------------------------------------------------------------------*/ const MainNavLinkWrapper = styled.styled(reactRouterDom.NavLink)`
  text-decoration: none;
  display: flex;
  border-radius: ${({ theme })=>theme.borderRadius};
  background: ${({ theme })=>theme.colors.neutral0};
  color: ${({ theme })=>theme.colors.neutral500};
  position: relative;
  width: fit-content;
  padding-block: 0.6rem;
  padding-inline: 0.6rem;

  &:hover {
    svg path {
      fill: ${({ theme })=>theme.colors.neutral600};
    }
    background: ${({ theme })=>theme.colors.neutral100};
  }

  &.active {
    svg path {
      fill: ${({ theme })=>theme.colors.primary600};
    }
    background: ${({ theme })=>theme.colors.primary100};
  }
`;
const getGuidedTourTooltip = (to)=>{
    const normalizedTo = to.toString().replace(/\//g, '');
    switch(normalizedTo){
        case 'content-manager':
            return Tours.tours.contentTypeBuilder.Finish;
        case '':
            return Tours.tours.apiTokens.Finish;
        case 'settings':
            return Tours.tours.contentManager.Finish;
        default:
            return React__namespace.Fragment;
    }
};
const LinkImpl = ({ children, ...props })=>{
    const GuidedTourTooltip = getGuidedTourTooltip(props.to);
    return /*#__PURE__*/ jsxRuntime.jsx(GuidedTourTooltip, {
        children: /*#__PURE__*/ jsxRuntime.jsx(MainNavLinkWrapper, {
            ...props,
            children: children
        })
    });
};
/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/ const TooltipImpl = ({ children, label, position = 'right' })=>{
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Tooltip, {
        side: position,
        label: label,
        delayDuration: 0,
        children: /*#__PURE__*/ jsxRuntime.jsx("span", {
            children: children
        })
    });
};
/* -------------------------------------------------------------------------------------------------
 * Icon
 * -----------------------------------------------------------------------------------------------*/ const IconImpl = ({ label, children })=>{
    if (!children) {
        return null;
    }
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.AccessibleIcon, {
        label: label,
        children: children
    });
};
/* -------------------------------------------------------------------------------------------------
 * Badge
 * -----------------------------------------------------------------------------------------------*/ const CustomBadge = styled.styled(designSystem.Badge)`
  /* override default badge styles to change the border radius of the Base element in the Design System */
  border-radius: ${({ theme })=>theme.spaces[10]};
  height: 2rem;
`;
const BadgeImpl = ({ children, label, ...props })=>{
    if (!children) {
        return null;
    }
    return /*#__PURE__*/ jsxRuntime.jsx(CustomBadge, {
        position: "absolute",
        top: "-0.8rem",
        left: "1.7rem",
        "aria-label": label,
        active: false,
        ...props,
        children: children
    });
};
/* -------------------------------------------------------------------------------------------------
 * EXPORTS
 * -----------------------------------------------------------------------------------------------*/ const NavLink = {
    Link: LinkImpl,
    Tooltip: TooltipImpl,
    Icon: IconImpl,
    Badge: BadgeImpl
};

exports.NavLink = NavLink;
//# sourceMappingURL=NavLink.js.map
