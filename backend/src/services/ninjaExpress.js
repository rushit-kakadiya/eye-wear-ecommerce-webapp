const config = require('config');
const db = require('../utilities/database');
const { messages, utils, errorHandler} = require('../core');

const {url, client_id, client_secret} = config.ninjaExpress;
//Email: devsupport@ninjavan.co
const generateOAuthAccessToken = async({countryCode = 'SG'}) => {
    try {
        let options = {
            url: `${url}/${countryCode}/2.0/oauth/access_token`,
            method: 'POST',
            data: {
                client_id,
                client_secret,
                'grant_type': 'client_credentials'
              }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const generateOrder = async({data, countryCode = 'SG'}) => {
    const {token} = await db.findOneByCondition({type: 'ninja'}, 'AccessTokens', ['token']);
    if(!token){
        // console.log('if token=>', token);
        const ninjaExpress = await generateOAuthAccessToken({countryCode}); 
        await db.saveData({token: ninjaExpress.access_token}, 'AccessTokens');
    }    
    try {
        // console.log('end point=>', `${url}/${countryCode}/4.1/orders`);
        // console.log('payload => ', JSON.stringify(data));
        // console.log('try token=>', token);
        let options = {
            url: `${url}/${countryCode}/4.1/orders`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data
        };
        const result = await utils.axiosClient(options);
        //console.log('result=>>>>>>>>>>>', JSON.stringify(result));
        return result.data;
    } catch (error) {
        if(error.message.search('401') > -1){
            const ninjaExpress = await generateOAuthAccessToken({countryCode}); 
            await db.updateOneByCondition({
                token: ninjaExpress.access_token
              }, {
                type: 'ninja'
              }, 'AccessTokens');
        }
        console.log('error=>>>>>>>>>>>', JSON.stringify(error));
        throw new Error(error.message);
    }
};

const generateOrderBill = async({trackingNumber, hideShipperDetail = false, countryCode = 'ID'}) => {
    try {
        let options = {
            url: `${url}/${countryCode}/2.0/reports/waybill?tids=${trackingNumber}&h=${hideShipperDetail}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const cancelOrder = async({trackingNo, token, countryCode = 'ID'}) => {
    try {
        let options = {
            url: `${url}/${countryCode}/2.2/orders/${trackingNo}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const holidays = async(data) => {
    if(await db.findOneByCondition({year: data.year}, 'Holidays', ['year'])) {
        throw errorHandler.customError(messages.yearExist);
    }
    return await db.saveData(data, 'Holidays');
};

const updateHolidays = async(data) => {
    return await db.updateOneByCondition(
        { dates: data.dates },
        { year: data.year },
        'Holidays'
      );
};

module.exports = {
    generateOAuthAccessToken,
    generateOrder,
    generateOrderBill,
    cancelOrder,
    holidays,
    updateHolidays
};