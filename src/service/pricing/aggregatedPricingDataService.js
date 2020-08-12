/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import CloudPricingDataService from './cloudPricingDataService';
import ProductInfoService from '../productInfo/productInfoService';

class AggregatedPricingDataService {
    async getAggregatedPricingData(req) {
        const cloudPricingCall = CloudPricingDataService.getCloudPricingData(req);

        const itemInfoCall = ProductInfoService.getProductInfo(
            req.body.businessUnitNumber, req.body.products[0].supc,
        );

        return Promise.all([
            cloudPricingCall,
            itemInfoCall,
        ])
            .then(([cloudPricingResponse, itemInfoResponse]) => ({
                cloudPricingResponse: {
                    cloudPricingResponseStatus: cloudPricingResponse.status,
                    cloudPricingResponseData: cloudPricingResponse.data,
                },
                itemInfoResponse: {
                    itemInfoResponseStatus: itemInfoResponse.status,
                    itemInfoResponseData: itemInfoResponse.data,
                },

            }));
    }
}

export default new AggregatedPricingDataService();
