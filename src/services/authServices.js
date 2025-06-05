import { authAxios, authAxiosGET } from "./HttpMethod";
import { profileInfoURL, companyInfoURL, getDbList } from "./ConstantServies";

export async function getProfileInfo() {
    try {
        const url = await profileInfoURL();
        if (!url) {
            throw new Error('Failed to get profile info URL');
        }
        const response = await authAxios(url);
        if (!response || !response.data) {
            throw new Error('No data received from profile info API');
        }
        return response;
    } catch (error) {
        console.error('Error in getProfileInfo:', error);
        throw error;
    }
}

export function getCompanyInfo() {
    return authAxios(companyInfoURL)
}

export function getDBListInfo() {
    let data = {
         'mobile_app_type': 'CRM_C'
      };
    return authAxiosGET(getDbList, data)
}

