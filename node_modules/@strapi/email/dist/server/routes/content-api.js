'use strict';

var contentApi = {
    type: 'content-api',
    routes: [
        {
            method: 'POST',
            path: '/',
            handler: 'email.send'
        }
    ]
};

module.exports = contentApi;
//# sourceMappingURL=content-api.js.map
