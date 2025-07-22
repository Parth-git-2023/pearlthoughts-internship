import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import axios from 'axios';
import { useInitQuery, useTelemetryPropertiesQuery } from '../services/admin.mjs';
import { useAppInfo } from './AppInfo.mjs';
import { useAuth } from './Auth.mjs';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/ const TrackingContext = /*#__PURE__*/ React.createContext({
    uuid: false
});
const TrackingProvider = ({ children })=>{
    const token = useAuth('App', (state)=>state.token);
    const { data: initData } = useInitQuery();
    const { uuid } = initData ?? {};
    const { data } = useTelemetryPropertiesQuery(undefined, {
        skip: !initData?.uuid || !token
    });
    const value = React.useMemo(()=>({
            uuid,
            telemetryProperties: data
        }), [
        uuid,
        data
    ]);
    return /*#__PURE__*/ jsx(TrackingContext.Provider, {
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
    const { uuid, telemetryProperties } = React.useContext(TrackingContext);
    const userId = useAppInfo('useTracking', (state)=>state.userId);
    const trackUsage = React.useCallback(async (event, properties)=>{
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

export { TrackingProvider, useTracking };
//# sourceMappingURL=Tracking.mjs.map
