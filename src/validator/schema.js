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

export const priceZoneReassignmentCreateReqBody = Joi.object({
    businessUnitNumber: Joi.string()
        .alphanum()
        .min(3)
        .max(3)
        .required(),
    itemAttributeGroup: Joi.string().required(),
    itemAttributeGroupId: Joi.string().required(),
    customerGroupId: Joi.string(),
    customerGroup: Joi.string().allow(null),
    customerAccount: Joi.string(),
    newPriceZone: Joi.number().integer().max(5).required(),
    effectiveFromDate: Joi.string().required(),
    submitter: Joi.object({
        id: Joi.string().required(),
        givenName: Joi.string().required(),
        surname: Joi.string().required(),
        email: Joi.string().email({ tlds: {allow: false} }).required(),
    }).required(),
}).xor('customerAccount', 'customerGroupId');

export const cipzApprovalRequestReqBody = Joi.object({
    requestId: Joi.number()
        .required(),

    status: Joi.string()
        .required(),

    approver: Joi.object({
        id: Joi.string()
            .alphanum()
            .required(),

        givenName: Joi.string()
            .required(),

        surname: Joi.string()
            .required(),

        email: Joi.string()
            .required()
    }),

});

