'use strict';

var EventSource = require('eventsource');

function notificationServiceFactory({ logger }) {
    return (url, token, cliConfig)=>{
        const CONN_TIMEOUT = Number(cliConfig.notificationsConnectionTimeout);
        const es = new EventSource(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        let timeoutId;
        const resetTimeout = ()=>{
            clearTimeout(timeoutId);
            timeoutId = setTimeout(()=>{
                logger.log('We were unable to connect to the server at this time. This could be due to a temporary issue. Please try again in a moment.');
                es.close();
            }, CONN_TIMEOUT); // 5 minutes
        };
        es.onopen = resetTimeout;
        es.onmessage = (event)=>{
            resetTimeout();
            const data = JSON.parse(event.data);
            if (data.message) {
                logger.log(data.message);
            }
            // Close connection when a specific event is received
            if (data.event === 'deploymentFinished' || data.event === 'deploymentFailed') {
                es.close();
            }
        };
    };
}

exports.notificationServiceFactory = notificationServiceFactory;
//# sourceMappingURL=notification.js.map
