import { z } from 'zod';
import { ValidationError } from './errors.mjs';

const validateZod = (schema)=>(data)=>{
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const { message, errors } = formatZodErrors(error);
                throw new ValidationError(message, {
                    errors
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

export { validateZod };
//# sourceMappingURL=zod.mjs.map
