/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

import axios from 'axios';


/**
 * Function  used to register the user for vaccination
 * @async
 * @function registerVaccination
 * @param {String} vaccineCenter Vaccination Center
 * @param {String} vaccineDate Vaccination Date
 * @param {String} vaccineMin Vaccination Minutues
 * @param {String} vaccineTime Vaccination Hours
 * @param {String} name Registered User Name
 * @param {String} nric Registered User NRIC Number
 * @returns {Object} Status
 */
const registerVaccination = async (params) => {
    try {
        let config = {
            method: 'POST',
            url: `${process.env.REACT_APP_PARSE_SERVER_URL}/functions/registerVaccination`,
            headers: {
                'X-Parse-Application-Id': process.env.REACT_APP_PARSE_SERVER_APP_ID,
                'X-Parse-REST-API-Key': process.env.REACT_APP_SDK_REST_API_KEY,
                'Content-Type': 'application/json'
            },
            data: params
        };
        const resp = await axios(config)
        return resp.data.result.status ? { status: true, data: resp.data.result.data } : { status: false, data: resp.data.result.data }
    } catch (error) {
        return { status: false, data: error }
    }
}

/**
 * Function  used to delete the registration
 * @async
 * @function deleteRegistration
 * @param {String} id Registered User Id
 * @returns {Object} Status
 */
const deleteRegistration = async (params) => {
    try {
        let config = {
            method: 'POST',
            url: `${process.env.REACT_APP_PARSE_SERVER_URL}/functions/deleteRegistration`,
            headers: {
                'X-Parse-Application-Id': process.env.REACT_APP_PARSE_SERVER_APP_ID,
                'X-Parse-REST-API-Key': process.env.REACT_APP_SDK_REST_API_KEY,
                'Content-Type': 'application/json'
            },
            data: params
        };
        const resp = await axios(config)
        return resp.data.result.status ? { status: true, data: resp.data.result.data } : { status: false, data: resp.data.result.data }
    } catch (error) {
        return { status: false, data: error }
    }
}

/**
 * Function  used to fetch the registration details
 * @async
 * @function fetchRegistrationDetails
 * @param {String} id Registered User Id
 * @returns {Object} Status
 */
const fetchRegistrationDetails = async (params) => {
    try {
        let config = {
            method: 'POST',
            url: `${process.env.REACT_APP_PARSE_SERVER_URL}/functions/fetchRegistrationDetails`,
            headers: {
                'X-Parse-Application-Id': process.env.REACT_APP_PARSE_SERVER_APP_ID,
                'X-Parse-REST-API-Key': process.env.REACT_APP_SDK_REST_API_KEY,
                'Content-Type': 'application/json'
            },
            data: params
        };
        const resp = await axios(config)
        return resp.data.result.status ? { status: true, data: resp.data.result.data } : { status: false, data: resp.data.result.data }
    } catch (error) {
        return { status: false, data: error }
    }
}

/**
 * Function  used to register the update the registered user for vaccination
 * @async
 * @function updateVaccinationDetails
 * @param {String} vaccineCenter Vaccination Center
 * @param {String} vaccineDate Vaccination Date
 * @param {String} vaccineMin Vaccination Minutues
 * @param {String} vaccineTime Vaccination Hours
 * @param {String} name Registered User Name
 * @param {String} nric Registered User NRIC Number
 * @returns {Object} Status
 */
const updateVaccinationDetails = async (params) => {
    try {
        let config = {
            method: 'POST',
            url: `${process.env.REACT_APP_PARSE_SERVER_URL}/functions/updateVaccinationDetails`,
            headers: {
                'X-Parse-Application-Id': process.env.REACT_APP_PARSE_SERVER_APP_ID,
                'X-Parse-REST-API-Key': process.env.REACT_APP_SDK_REST_API_KEY,
                'Content-Type': 'application/json'
            },
            data: params
        };
        const resp = await axios(config)
        return resp.data.result.status ? { status: true, data: resp.data.result.data } : { status: false, data: resp.data.result.data }
    } catch (error) {
        return { status: false, data: error }
    }
}

export { registerVaccination, deleteRegistration, fetchRegistrationDetails ,updateVaccinationDetails}