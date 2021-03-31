const Joi = require('joi');

const querySchema = Joi.object({
    sort: Joi.string(),
    limit: Joi.string(),
    loginSubstring: Joi.string()
});

const bodySchemaForCreate = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
        .required()
});

const bodySchemaForUpdate = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
});

module.exports = { querySchema, bodySchemaForCreate, bodySchemaForUpdate };
