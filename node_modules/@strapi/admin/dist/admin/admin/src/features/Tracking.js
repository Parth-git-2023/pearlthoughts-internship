'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var axios = require('axios');
var admin = require('../services/admin.js');
var AppInfo = require('./AppInfo.js');
var Auth = require('./Auth.js');

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
 * Context
 * -----------------------------------------------------------------------------------------------*/ const TrackingContext = /*#__PURE__*/ React__namespace.createContext({
    uuid: false
});
const TrackingProvider = ({ children })=>{
    const token = Auth.useAuth('App', (state)=>state.token);
    const { data: initData } = admin.useInitQuery();
    const { uuid } = initData ?? {};
    const { data } = admin.useTelemetryPropertiesQuery(undefined, {
        skip: !initData?.uuid || !token
    });
    const value = React__namespace.useMemo(()=>({
            uuid,
            telemetryProperties: data
        }), [
        uuid,
        data
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx(TrackingContext.Provider, {
        value: value,
        children: children
    });
};
/**
 * @description Used to send amplitude events to the Strapi Tracking hub.
 *
 * @example
 * ```tsx
 * import { useTracking } from '@strapi/strapi/admin';
 *
 * const MyComponent = () => {
 *  const { trackUsage } = useTracking();
 *
 *  const handleClick = () => {
 *   trackUsage('my-event', { myProperty: 'myValue' });
 *  }
 *
 *  return <button onClick={handleClick}>Send Event</button>
 * }
 * ```
 */ const useTracking = ()=>{
    const { uuid, telemetryProperties } = React__namespace.useContext(TrackingContext);
    const userId = AppInfo.useAppInfo('useTracking', (state)=>state.userId);
    const trackUsage = React__namespace.useCallback(async (event, properties)=>{
        try {
            if (uuid && !window.strapi.telemetryDisabled) {
                const res = await axios.post('https://analytics.strapi.io/api/v2/track', {
                    event,
                    userId,
                    eventProperties: {
                        ...properties
                    },
                    userProperties: {},
                    groupProperties: {
                        ...telemetryProperties,
                        projectId: uuid,
                        projectType: window.strapi.projectType
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Strapi-Event': event
                    }
                });
                return res;
            }
        } catch (err) {
        // Silence is golden
        }
        return null;
    }, [
        telemetryProperties,
        userId,
        uuid
    ]);
    return {
        trackUsage
    };
};

exports.TrackingProvider = TrackingProvider;
exports.useTracking = useTracking;
//# sourceMappingURL=Tracking.js.map
