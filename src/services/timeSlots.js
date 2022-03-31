/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/

 import axios from 'axios';

  /**
  * Function used to verify the OTP from the Customer
  * @async
  * @function fetchVaccineCenterList

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
         return resp.data.result.status ?  { status: true, data: resp.data.result.data } :  { status: false, data: resp.data.result.data } 
     } catch (error) {
         return { status: false, data: error }
     }
 }
 
 export { fetchTimeSlots }