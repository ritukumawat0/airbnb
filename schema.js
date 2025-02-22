const Joi = require('joi');

module.exports.listingSchemaJoi = Joi.object({
    listing:Joi.object({
        title:Joi.string().min(3).max(100).required(),
        description:Joi.string().min(5).max(500).required(),
        price:Joi.number().min(0).required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchemaJoi = Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().min(3).max(500).required()
    }).required()
})
