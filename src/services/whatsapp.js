const config = require('config');
const db = require('../utilities/database');
const { utils} = require('../core');

const whatsappAuth = async() => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/oauth/token`,
            method: 'POST',
            data: {
                'username': config.whatsapp.username,
                'password': config.whatsapp.password,
                'grant_type': 'password',
                'client_id': config.whatsapp.client_id,
                'client_secret': config.whatsapp.client_secret
              }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getChannel = async(token) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/integrations?target_channel=wa`,
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

const getTemplate = async(token) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/templates/whatsapp`,
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

const createTemplate = async(token) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/templates/whatsapp`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                'name': 'eyewear',
                'category': 'ACCOUNT_UPDATE',
                'attributes': [
                  {
                    'components': [
                      {
                        'type': 'BODY',
                        'text': 'Your OTP is'
                      }
                    ],
                    'language': 'en'
                  }
                ]
              }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const sendMessage = async({token, otp, number, name}) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/broadcasts/whatsapp/direct`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                'to_number': number,
                'to_name': name,
                'message_template_id': '717b69f1-eae5-44eb-a4ee-f35ed9285733',
                'channel_integration_id': '2375bdb2-4369-44ce-9f52-51a530cb55f4',
                'language': {
                    'code': 'id'
                },
                'parameters': {
                    'body': [
                        {
                            'key': '1',
                            'value': 'OTP',
                            'value_text': otp
                        }
                    ]
                }
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};



const sendWhtsAppMessage = async({token, number, name, template_id, body}) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/broadcasts/whatsapp/direct`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                'to_number': number,
                'to_name': name,
                'message_template_id': template_id,
                'channel_integration_id': '2375bdb2-4369-44ce-9f52-51a530cb55f4',
                'language': {
                    'code': 'id'
                },
                'parameters': {
                    'body' : body
                }
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getLogs = async(token) => {
    try {
        let options = {
            url: `${config.whatsapp.baseUrl}/api/open/v1/broadcasts/bbe48342-0e14-4695-b9e3-26608851545d/whatsapp/log`,
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

module.exports = {
    sendMessage,
    sendWhtsAppMessage,
    whatsappAuth,
    getChannel,
    getTemplate,
    createTemplate,
    getLogs
};
