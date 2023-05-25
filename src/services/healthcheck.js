
const db = require('../utilities/database');

const protectedApi = async (payload) => {
    return  {
        status: 'protected working properly',
    };
};

const open = async (payload) => {
    return  {
        status: 'dev open working properly',
    };
};

module.exports = {
    open,
    protectedApi
};
