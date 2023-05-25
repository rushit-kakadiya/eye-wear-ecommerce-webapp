const config = require('config');
const _ = require('lodash');
const JWT = require('jsonwebtoken');

const HMACSHA256 = require('crypto-js/hmac-sha256');
const BASE64 = require('crypto-js/enc-base64');

const { exception, constants } = require('../core');
const { database: db } = require('../utilities');

const invalidKeyMessage = 'Invalid API Key';
const missingKeyMessage = 'Please provide API key';
const tokenMissingMessage = 'Please provide auth token';
const unauthorisedMessage = 'Invalid Token';

const authProtected = (req, res, next) => {
    if (_.has(req.headers, 'x-api-key')) {
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== config.app.apiKey) {
            req.error = new Error(invalidKeyMessage);
            return exception.customException(req, res, invalidKeyMessage, 401);
        }
    } else {
        req.error =  new Error(missingKeyMessage);
        return exception.customException(req, res, missingKeyMessage, 401);
    }
    next();
};

const callBackProtected = (req, res, next) => {
    if (_.has(req.headers, 'x-callback-token')) {
        const callbackToken = req.headers['x-callback-token'];
        if (callbackToken !== config.xendit.callbackToken) {
            req.error = new Error(invalidKeyMessage);
            return exception.customException(req, res, invalidKeyMessage, 401);
        }
    } else {
        req.error =  new Error(missingKeyMessage);
        return exception.customException(req, res, missingKeyMessage, 401);
    }
    next();
};

const callBackCardlessProtected = (req, res, next) => {
    if (_.has(req.body, 'callback_authentication_token')) {
        const callbackToken = req.body['callback_authentication_token'];
        if (callbackToken !== config.xendit.callbackToken) {
            req.error = new Error(invalidKeyMessage);
            return exception.customException(req, res, invalidKeyMessage, 401);
        }
    } else {
        req.error =  new Error(missingKeyMessage);
        return exception.customException(req, res, missingKeyMessage, 401);
    }
    next();
};

const callBackNinjaProtected = (req, res, next) => {
    if (_.has(req.headers, 'x-ninjavan-hmac-sha256')) {
        const callbackToken = req.headers['x-ninjavan-hmac-sha256'];
        const calculatedHmac = BASE64.stringify(HMACSHA256(JSON.stringify(req.body), config.ninjaExpress.client_secret));
        if (callbackToken !== calculatedHmac) {
            req.error = new Error(invalidKeyMessage);
            return exception.customException(req, res, invalidKeyMessage, 401);
        }
    } else {
        req.error =  new Error(missingKeyMessage);
        return exception.customException(req, res, missingKeyMessage, 401);
    }
    next();
};

const authFilter = async (req, res, next) => {
    try {
        if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] === 'Bearer') {
            let jwtToken = req.headers['authorization'].split(' ')[1];
            const decoded = JWT.verify(jwtToken, config.app.jwtKey);
            // const user = await db.findOneByCondition({login_token: jwtToken}, 'UserDevices', ['id']);
            let query = `select us.id, us."name", us."country_code", us.mobile, us.email, us.role,
                us.is_first_order, us.registration_referral_code, us.created_at, us.store_id, ur.role as access_role
                from user_devices ud
                inner join users us on ud.user_id = us.id 
                left join user_roles ur on ur.user_id = us.id
                where us.status = 1 and login_token = :jwtToken`;
            let replacementes = {
                user_id: decoded.id,
                jwtToken
            };
            let user = await db.rawQuery(query, 'SELECT', replacementes);
            if(user.length > 0){
                req.user = user[0];
                next();
            } else {
                req.error =  new Error(unauthorisedMessage);
                return exception.customException(req, res, unauthorisedMessage, 401);
            }
        } else {
            req.error =  new Error(tokenMissingMessage);
            return exception.customException(req, res, tokenMissingMessage, 401);
        }
    } catch(err) {
        req.error =  new Error(unauthorisedMessage);
        return exception.customException(req, res, unauthorisedMessage, 401);
    }

};

const authFilterAndUnAuthFilter = async (req, res, next) => {
	try {
		if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] === 'Bearer') {
			let jwtToken = req.headers['authorization'].split(' ')[1];
			const decoded = JWT.verify(jwtToken, config.app.jwtKey);
			const user = await db.findOneByCondition({login_token: jwtToken}, 'UserDevices', ['id']);
			if(user){
				req.user = decoded;
				next();
			} else {
                req.error =  new Error(unauthorisedMessage);
				return exception.customException(req, res, unauthorisedMessage, 401);
			}
		} else {
			req.user = {};
			next();
	    }
} catch(err) {
	req.error =  new Error(unauthorisedMessage);
	return exception.customException(req, res, unauthorisedMessage, 401);
}
};

const generateJwtToken = (user) => {
    const data = {
			when: Date.now(),
			role: user.role,
			id: user.id,
			email: user.email
		};
    return JWT.sign(data, config.app.jwtKey, { algorithm: config.app.jwtAlgo, expiresIn: '90d' });
};

const aclFilter = async (req, res, next) => {
    const userAccess = await db.findByCondition({role: req.user.access_role, status: true}, 'RoleAccess', ['module_name', 'is_get', 'is_add', 'is_update', 'is_delete']);
    if(req.user.access_role === 'super-admin') {
        next();
    } else if(userAccess.findIndex(row => req.url.includes(row.module_name) && ((row.is_get && req.method === 'GET') || (row.is_add && req.method === 'POST') || (row.is_update && req.method === 'PUT') || (row.is_delete && req.method === 'DELETE'))) > -1) {
        next();
    } else {
        req.error =  new Error(unauthorisedMessage);
        return exception.customException(req, res, unauthorisedMessage, 401);
    }
};

module.exports = {
    authProtected,
    authFilter,
    authFilterAndUnAuthFilter,
    generateJwtToken,
    callBackProtected,
    callBackCardlessProtected,
    callBackNinjaProtected,
    aclFilter
};