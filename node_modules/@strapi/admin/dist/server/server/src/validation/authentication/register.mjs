import { yup, validateYupSchema } from '@strapi/utils';
import validators from '../common-validators.mjs';

const registrationSchema = yup.object().shape({
    registrationToken: yup.string().required(),
    userInfo: yup.object().shape({
        firstname: validators.firstname.required(),
        lastname: validators.lastname.nullable(),
        password: validators.password.required()
    }).required().noUnknown()
}).noUnknown();
const registrationInfoQuerySchema = yup.object().shape({
    registrationToken: yup.string().required()
}).required().noUnknown();
const adminRegistrationSchema = yup.object().shape({
    email: validators.email.required(),
    firstname: validators.firstname.required(),
    lastname: validators.lastname.nullable(),
    password: validators.password.required()
}).required().noUnknown();
const validateRegistrationInput = validateYupSchema(registrationSchema);
const validateRegistrationInfoQuery = validateYupSchema(registrationInfoQuerySchema);
const validateAdminRegistrationInput = validateYupSchema(adminRegistrationSchema);

export { validateAdminRegistrationInput, validateRegistrationInfoQuery, validateRegistrationInput };
//# sourceMappingURL=register.mjs.map
