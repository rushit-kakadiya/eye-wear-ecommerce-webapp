const db = require('../utilities/database');

const addPage = async (data) => {
    return await db.saveData(data, 'Page');
}; 

const getPage = async (data) => {
    return await db.findByCondition(data, 'Page');
}; 

module.exports = {
    addPage,
    getPage
};