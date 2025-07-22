import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';
import { Field, TextInput } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { nameToSlug } from '../utils/nameToSlug.mjs';

const SingularName = ({ description = null, error = null, intlLabel, modifiedData, name, onChange, value = null })=>{
    const { formatMessage } = useIntl();
    const onChangeRef = useRef(onChange);
    const displayName = modifiedData?.displayName || '';
    useEffect(()=>{
        if (displayName) {
            onChangeRef.current({
                target: {
                    name,
                    value: nameToSlug(displayName)
                }
            });
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
    return /*#__PURE__*/ jsxs(Field.Root, {
        error: errorMessage,
        hint: hint,
        name: name,
        children: [
            /*#__PURE__*/ jsx(Field.Label, {
                children: label
            }),
            /*#__PURE__*/ jsx(TextInput, {
                onChange: onChange,
                value: value || ''
            }),
            /*#__PURE__*/ jsx(Field.Error, {}),
            /*#__PURE__*/ jsx(Field.Hint, {})
        ]
    });
};

export { SingularName };
//# sourceMappingURL=SingularName.mjs.map
