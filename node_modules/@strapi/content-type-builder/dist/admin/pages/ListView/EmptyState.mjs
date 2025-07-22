import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { unstable_tours } from '@strapi/admin/strapi-admin';
import { Box, Flex, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad.mjs';

const EmptyState = ()=>{
    const { formatMessage } = useIntl();
    const pluginName = formatMessage({
        id: getTrad('plugin.name'),
        defaultMessage: 'Content-Type Builder'
    });
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx(unstable_tours.contentTypeBuilder.Introduction, {
                children: /*#__PURE__*/ jsx(Box, {
                    paddingTop: 5
                })
            }),
            /*#__PURE__*/ jsxs(Flex, {
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                direction: "column",
                children: [
                    /*#__PURE__*/ jsx(Typography, {
                        variant: "alpha",
                        children: pluginName
                    }),
                    /*#__PURE__*/ jsx(Typography, {
                        variant: "delta",
                        children: formatMessage({
                            id: getTrad('table.content.create-first-content-type'),
                            defaultMessage: 'Create your first Collection-Type'
                        })
                    })
                ]
            })
        ]
    });
};

export { EmptyState };
//# sourceMappingURL=EmptyState.mjs.map
