const Joi = require("joi");

const StduentSchemaValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  city: Joi.string().min(1).max(10).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "in"] },
  }),
  password: Joi.string().min(8).required(),
});

const ProductSchemaValidation = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string().required(), // ObjectId as string
  description: Joi.string().min(1).max(500).required(),
  image: Joi.string().required(), // filename
});

module.exports = { StduentSchemaValidation, ProductSchemaValidation };
