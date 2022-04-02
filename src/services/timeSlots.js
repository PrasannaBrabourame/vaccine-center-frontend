/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

import axios from 'axios';


/**
* Function  used to fetch the Hours and Mins Available Slots
* @async
* @function fetchTimeSlots
* @returns {Object} Status
*/

const fetchTimeSlots = async (params) => {
    try {
        let config = {
            method: 'POST',
            url: `${process.env.REACT_APP_PARSE_SERVER_URL}/functions/fetchSlots`,
            headers: {
                'X-Parse-Application-Id': process.env.REACT_APP_PARSE_SERVER_APP_ID,
                'X-Parse-REST-API-Key': process.env.REACT_APP_SDK_REST_API_KEY,
                'Content-Type': 'application/json'
            }
        };
        const resp = await axios(config)
        return resp.data.result.status ? { status: true, data: resp.data.result.data } : { status: false, data: resp.data.result.data }
    } catch (error) {
        return { status: false, data: error }
    }
}

export { fetchTimeSlots }