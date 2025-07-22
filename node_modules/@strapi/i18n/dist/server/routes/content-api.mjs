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

export { contentApi as default };
//# sourceMappingURL=content-api.mjs.map
