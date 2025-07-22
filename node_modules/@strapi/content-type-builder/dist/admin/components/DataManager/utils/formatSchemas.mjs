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

export { formatSchema, toAttributesArray };
//# sourceMappingURL=formatSchemas.mjs.map
