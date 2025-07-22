'use strict';

var utils = require('@strapi/utils');

const sendEvent = async (event, uuid, installId)=>{
    try {
        await fetch('https://analytics.strapi.io/api/v2/track', {
            method: 'POST',
            body: JSON.stringify({
                event,
                deviceId: utils.generateInstallId(uuid, installId),
                groupProperties: {
                    projectId: uuid
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-Strapi-Event': event
            }
        });
    } catch (e) {
    // ...
    }
};

exports.sendEvent = sendEvent;
//# sourceMappingURL=telemetry.js.map
