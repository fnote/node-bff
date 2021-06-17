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

<<<<<<< HEAD
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

});
=======
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

>>>>>>> task/TRSP-107-bff-implementation
