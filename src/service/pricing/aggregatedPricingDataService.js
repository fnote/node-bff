/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import CloudPricingDataService from "./cloudPricingDataService";

class AggregatedPricingDataService {

    getAggregatedPricingData = async (req) => {
        const cloudPricingCall = CloudPricingDataService.getCloudPricingData(req);

        //call item info service and throw error if an error occurred
        const itemInfoValues = {
            data: {
                'itemName': 'abc',
                "itemInfoResponseStatus": 200,
            }
        };

        const itemInfoCall = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(itemInfoValues)
                }, 500)
            })
        };

        return await Promise.all([
            cloudPricingCall,
            itemInfoCall()
        ])
            .then(([cloudPricingResponse, itemInfoResponse]) => {
                return {
                    'cloudPricingResponse': {
                        'cloudPricingResponseStatus': cloudPricingResponse.status,
                        'cloudPricingResponseData': cloudPricingResponse.data
                    },
                    'itemInfoResponse': itemInfoResponse.data
                };
            });
    }

}

export default new AggregatedPricingDataService();