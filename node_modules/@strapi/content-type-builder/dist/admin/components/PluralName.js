'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var designSystem = require('@strapi/design-system');
var pluralize = require('pluralize');
var reactIntl = require('react-intl');
var nameToSlug = require('../utils/nameToSlug.js');

const PluralName = ({ description, error, intlLabel, modifiedData, name, onChange, value })=>{
    const { formatMessage } = reactIntl.useIntl();
    const onChangeRef = React.useRef(onChange);
    const displayName = modifiedData?.displayName || '';
    React.useEffect(()=>{
        if (displayName) {
            const value = nameToSlug.nameToSlug(displayName);
            try {
                const plural = pluralize(value, 2);
                onChangeRef.current({
                    target: {
                        name,
                        value: plural
                    }
                });
            } catch (err) {
                onChangeRef.current({
                    target: {
                        name,
                        value
                    }
                });
            }
        } else {
            onChangeRef.current({
                target: {
                    name,
                    value: ''
                }
            });
        }
    }, [
        displayName,
        name
    ]);
    const errorMessage = error ? formatMessage({
        id: error,
        defaultMessage: error
    }) : '';
    const hint = description ? formatMessage({
        id: description.id,
        defaultMessage: description.defaultMessage
    }, {
        ...description.values
    }) : '';
    const label = formatMessage(intlLabel);
    return /*#__PURE__*/ jsxRuntime.jsxs(designSystem.Field.Root, {
        error: errorMessage,
        hint: hint,
        name: name,
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Field.Label, {
                children: label
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.TextInput, {
                onChange: onChange,
                value: value || ''
            }),
            /*#__PURE__*/ jsxRuntime.jsx(designSystem.Field.Error, {})
        ]
    });
};

exports.PluralName = PluralName;
//# sourceMappingURL=PluralName.js.map
