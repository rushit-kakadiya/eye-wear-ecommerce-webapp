const db = require('../../utilities/database');
const { constants } = require('../../core');

const addCustomerActivityLogs = async (payload) => {
    const logsData = {
        source_id: payload.user_id,
        type: constants.logs_type.customer,
        action: payload.action,
        new_val: payload.new_val || {},
        old_val: payload.old_val || {},
        created_at: new Date(),
        created_by: payload.created_by || payload.user_id
    };
    return await db.saveData(logsData, 'Logs');
};

const getCustomerActivityLogs = async (user_id) => {
    return await db.rawQuery(
        `select lh.id, lh.source_id, lh.type, lh.action, lh.created_at, case when u.name is null then 'admin' else u.name end
          from logs_history as lh left join users as u on u.id = lh.created_by
          where lh.source_id = :source_id order by created_at DESC`,
        'SELECT', { source_id: user_id }
    );
};

module.exports = {
    addCustomerActivityLogs,
    getCustomerActivityLogs
};