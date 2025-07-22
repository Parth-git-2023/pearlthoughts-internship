'use strict';

var zod = require('zod');
var errors = require('./errors.js');

const validateZod = (schema)=>(data)=>{
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof zod.z.ZodError) {
                const { message, errors: errors$1 } = formatZodErrors(error);
                throw new errors.ValidationError(message, {
                    errors: errors$1
                });
            }
            throw error;
        }
    };
const formatZodErrors = (zodError)=>({
        errors: zodError.format((issue)=>{
            return {
                path: issue.path,
                message: issue.message,
                name: issue.code
            };
        }),
        message: 'Validation error'
    });

exports.validateZod = validateZod;
//# sourceMappingURL=zod.js.map
