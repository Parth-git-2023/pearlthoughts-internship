'use strict';

var getFetchClient = require('./getFetchClient.js');

const simpleQuery = async (query, { signal })=>{
    try {
        const { get, post, del, put } = getFetchClient.getFetchClient();
        if (typeof query === 'string') {
            const result = await get(query, {
                signal
            });
            return {
                data: result.data
            };
        } else {
            const { url, method = 'GET', data, config } = query;
            if (method === 'POST') {
                const result = await post(url, data, {
                    ...config,
                    signal
                });
                return {
                    data: result.data
                };
            }
            if (method === 'DELETE') {
                const result = await del(url, {
                    ...config,
                    signal
                });
                return {
                    data: result.data
                };
            }
            if (method === 'PUT') {
                const result = await put(url, data, {
                    ...config,
                    signal
                });
                return {
                    data: result.data
                };
            }
            /**
       * Default is GET.
       */ const result = await get(url, {
                ...config,
                signal
            });
            return {
                data: result.data
            };
        }
    } catch (err) {
        // Handle error of type FetchError
        if (getFetchClient.isFetchError(err)) {
            if (typeof err.response?.data === 'object' && err.response?.data !== null && 'error' in err.response?.data) {
                /**
         * This will most likely be ApiError
         */ return {
                    data: undefined,
                    error: err.response?.data.error
                };
            } else {
                return {
                    data: undefined,
                    error: {
                        name: 'UnknownError',
                        message: err.message,
                        details: err.response,
                        status: err.status
                    }
                };
            }
        }
        const error = err;
        return {
            data: undefined,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        };
    }
};
const fetchBaseQuery = ()=>simpleQuery;
const isBaseQueryError = (error)=>{
    return error.name !== undefined;
};

exports.fetchBaseQuery = fetchBaseQuery;
exports.isBaseQueryError = isBaseQueryError;
//# sourceMappingURL=baseQuery.js.map
