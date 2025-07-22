import { generateInstallId } from '@strapi/utils';

const sendEvent = async (event, uuid, installId)=>{
    try {
        await fetch('https://analytics.strapi.io/api/v2/track', {
            method: 'POST',
            body: JSON.stringify({
                event,
                deviceId: generateInstallId(uuid, installId),
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

export { sendEvent };
//# sourceMappingURL=telemetry.mjs.map
