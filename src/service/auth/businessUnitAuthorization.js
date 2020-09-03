/**
 * Business unit authorization
 *
 * @author: adis0892 on 28/08/20
 * */

import BusinessUnitDao from '../../dao/businessUnitDao'
import {ROLE_APP_ADMIN, ROLE_GENERAL_USER} from "../../util/constants";
class BusinessUnitAuthorization {
    businessUnitDetailsArray;

    loadBusinessUnitDetails = async () => {
        this.businessUnitDetailsArray = await BusinessUnitDao.getBusinessUnitDetails();
    };

    matchedValidBusinessUnitFromGivenList = (bUnit, bUnitDetailsList) => {
        if(bUnitDetailsList) {
            return bUnitDetailsList.filter(bUnitDetails =>
                bUnit === bUnitDetails.bunit_id
            )
        } else {
            return [];
        }
    }

    matchedPricingTransformationEnabledBusinessUnit = (bUnit) => {
        if(this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter(bUnitDetails =>
                bUnit === bUnitDetails.bunit_id && bUnitDetails.periscope_on === "Y"
            )
        } else {
            return [];
        }
    }

    generatePricingTransformationEnabledAllBusinessUnit = () => {
        if(this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter(bUnitDetails =>
                bUnitDetails.periscope_on === "Y"
            )
        } else {
            return [];
        }
    }

    getAuthorizedBusinessUnits = (opcoAttributeBunit, userRole) => {
        if(userRole === ROLE_APP_ADMIN || userRole === ROLE_GENERAL_USER) {
            // If these user roles, they should have access to all opcos
            return this.generatePricingTransformationEnabledAllBusinessUnit();
        } else if (!opcoAttributeBunit) {
            // If AD opco attribute is null or empty, then he should not have access to any opco
            return []
        } else {
            const matchedValidBusinessUnitList =
                this.matchedValidBusinessUnitFromGivenList(opcoAttributeBunit, this.businessUnitDetailsArray);

            if(matchedValidBusinessUnitList.length > 0) {

                const authorizedPricingTransformationEnabledBusinessUnitList =
                    this.matchedPricingTransformationEnabledBusinessUnit(opcoAttributeBunit);

                if(authorizedPricingTransformationEnabledBusinessUnitList.length > 0) {
                    // Opco attribute matches one of the opcos and also is a pricing transformation enabled opco then return that opco
                    return authorizedPricingTransformationEnabledBusinessUnitList
                } else {
                    // Opco attribute matches one of the opcos but is not a pricing transformation enabled opco
                    // so then he has access to no matching opco
                    return []
                }
            } else {
                // Opco attribute does not match to one of Sysco opcos, so it should be something like 000 (Corporate) or 440 (SBS)
                // so then give access to all opcos
                // In future, if we can identify what exactly these values can be, then can do a separate filtering
                return this.generatePricingTransformationEnabledAllBusinessUnit();
            }
        }
    }

    isAuthorizedRequest = (req, res) => {
        const {authResponse} = res.locals;
        const requestedBunit = req.body.businessUnitNumber;
        const userDetailsData = authResponse.userDetailsData;

        if(userDetailsData && Object.keys(userDetailsData).length > 0) {
            const authorizedBunitListForTheUser = userDetailsData.authorizedBunitList;
            const filteredOutBunits = this.matchedValidBusinessUnitFromGivenList(requestedBunit, authorizedBunitListForTheUser)
            if(filteredOutBunits.length > 0) {
                return true;
            }
        }
        return false;
    }
}

export default new BusinessUnitAuthorization();
