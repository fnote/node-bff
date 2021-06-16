import Joi from 'joi';

export const pricingDataReqBody = Joi.object({
    businessUnitNumber: Joi.string()
        .alphanum()
        .min(3)
        .max(3)
        .required(),

    customerAccount: Joi.string()
        .alphanum()
        .required(),

    priceRequestDate: Joi.string()
        .required(),

    requestedQuantity: Joi.number()
        .required(),

    product: Joi.object({
        supc: Joi.string()
            .alphanum()
            .required(),

        splitFlag: Joi.boolean(),

        orderPrice: Joi.number(),

        orderPriceType: Joi.string(),
    }),

});

export const priceZoneReassignmentSearchReqBody = Joi.object({
    businessUnitNumber: Joi.string()
        .alphanum()
        .min(3)
        .max(3)
        .required(),
    itemAttributeGroupId: Joi.string().required(),
    customerAccount: Joi.string(),
    customerGroupId: Joi.string(),
    offset: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
}).xor('customerAccount', 'customerGroupId');
