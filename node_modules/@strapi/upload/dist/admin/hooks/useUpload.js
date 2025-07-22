'use strict';

var React = require('react');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var reactQuery = require('react-query');
var pluginId = require('../pluginId.js');

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

const endpoint = `/${pluginId.pluginId}`;
const uploadAsset = (asset, folderId, signal, onProgress, post)=>{
    const { rawFile, caption, name, alternativeText } = asset;
    const formData = new FormData();
    formData.append('files', rawFile);
    formData.append('fileInfo', JSON.stringify({
        name,
        caption,
        alternativeText,
        folder: folderId
    }));
    /**
   * onProgress is not possible using native fetch
   * need to look into an alternative to make it work
   * perhaps using xhr like Axios does
   */ return post(endpoint, formData, {
        signal
    }).then((res)=>res.data);
};
const useUpload = ()=>{
    const [progress, setProgress] = React__namespace.useState(0);
    const queryClient = reactQuery.useQueryClient();
    const abortController = new AbortController();
    const signal = abortController.signal;
    const { post } = strapiAdmin.useFetchClient();
    const mutation = reactQuery.useMutation(({ asset, folderId })=>{
        return uploadAsset(asset, folderId, signal, setProgress, post);
    }, {
        onSuccess () {
            queryClient.refetchQueries([
                pluginId.pluginId,
                'assets'
            ], {
                active: true
            });
            queryClient.refetchQueries([
                pluginId.pluginId,
                'asset-count'
            ], {
                active: true
            });
        }
    });
    const upload = (asset, folderId)=>mutation.mutateAsync({
            asset,
            folderId
        });
    const cancel = ()=>abortController.abort();
    return {
        upload,
        isLoading: mutation.isLoading,
        cancel,
        error: mutation.error,
        progress,
        status: mutation.status
    };
};

exports.useUpload = useUpload;
//# sourceMappingURL=useUpload.js.map
