'use strict';

var contentApi = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: '/locales',
            handler: 'locales.listLocales'
        }
    ]
};

module.exports = contentApi;
//# sourceMappingURL=content-api.js.map
