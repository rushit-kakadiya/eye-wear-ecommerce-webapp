const config = require('config');
const { utils} = require('../core');


const sendOtpMiscall = async({number,gateway}) => {
    try {
        let options = {
            url: `${config.citcall.baseUrl}/gateway/v3/asynccall`,
            method: 'POST',
            headers: {
                'Authorization': `Apikey ${config.citcall.key}`
            },
            data: {
                'msisdn': number,
                'gateway': gateway == 3 ? config.citcall.gateway : config.citcall.indoGateway,
                'retry': gateway == 3 ? config.citcall.retry : config.citcall.indoRetry,
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    sendOtpMiscall
};