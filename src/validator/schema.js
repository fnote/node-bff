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
    business_unit_number: Joi.string()
        .alphanum()
        .min(3)
        .max(3)
        .required(),
    item_attribute_group_id: Joi.string().required(),
    customer_account: Joi.string().allow(null),
    customer_group_id: Joi.string().allow(null),
    offset: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
}).or('customer_account', 'customer_group_id');

export const priceZoneReassignmentCreateReqBody = Joi.object({
    businessUnitNumber: Joi.string()
        .alphanum()
        .min(3)
        .max(3)
        .required(),
    itemAttributeGroup: Joi.string().required(),
    itemAttributeGroupId: Joi.string().required(),
    customerGroup: Joi.string().allow(null),
    customerAccount: Joi.string().allow(null),
    newPriceZone: Joi.number().integer().required(),
    effectiveFromDate: Joi.string().required(),
    submissionNote: Joi.string().required(),
    submitter: Joi.object({
        id: Joi.string().required(),
        givenName: Joi.string().required(),
        surname: Joi.string().required(),
        email: Joi.string().email({ tlds: {allow: false} }).required(),
    }).required(),
});

export const cipzApprovalRequestReqBody = Joi.object({
    requestId: Joi.number()
        .required(),
    reviewer: Joi.object({
        id: Joi.string()
            .alphanum()
            .required(),
        givenName: Joi.string()
            .required(),
        surname: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
    }),
    reviewNote: Joi.optional(),
    status: Joi.string()
        .required(),
});
