'use strict';

const formatSchema = (schema)=>{
    return {
        ...schema,
        attributes: toAttributesArray(schema.attributes)
    };
};
const toAttributesArray = (attributes)=>{
    return Object.keys(attributes).reduce((acc, current)=>{
        acc.push({
            ...attributes[current],
            name: current
        });
        return acc;
    }, []);
};

exports.formatSchema = formatSchema;
exports.toAttributesArray = toAttributesArray;
//# sourceMappingURL=formatSchemas.js.map
