const _ = require('lodash');
const { exception, constants } = require('../core');

const locationFilter = async (req, res, next) => {
    try {

        let errorMessage = '';

        // if(_.isUndefined(req.headers['app_version'])) {
        //     errorMessage = 'App version is mandetory';
        //     req.error =  new Error(errorMessage);
        //     return exception.customException(req, res, errorMessage, 400);
        // } else if(_.isUndefined(req.headers['language'])) {
        //     errorMessage = 'App language is mandetory';
        //     req.error =  new Error(errorMessage);
        //     return exception.customException(req, res, errorMessage, 400);
        // } else if(_.isUndefined(req.headers['country_code'])) {
        //     errorMessage = 'Country code is mandetory';
        //     req.error =  new Error(errorMessage);
        //     return exception.customException(req, res, errorMessage, 400);
        // } else if(_.isUndefined(req.headers['currency_code'])) {
        //     errorMessage = 'Currency code is mandetory';
        //     req.error =  new Error(errorMessage);
        //     return exception.customException(req, res, errorMessage, 400);
        // } else if(_.isUndefined(req.headers['timezone'])) {
        //     errorMessage = 'timezone is mandetory';
        //     req.error =  new Error(errorMessage);
        //     return exception.customException(req, res, errorMessage, 400);
        // }


        req.location = {
            app_version: req.headers['app-version'] || 1,
            language: req.headers['language'] || constants.location.language,
            country_code: req.headers['country-code'] || constants.location.country_code,
            currency_code: req.headers['currency-code'] || constants.location.currency_code,
            timezone: req.headers['timezone'] || constants.location.timezone,
        };
        next();
    } catch(err) {
        req.error =  new Error('Error');
        return exception.customException(req, res, 'Error', 401);
    }

};

module.exports = {
    locationFilter
};