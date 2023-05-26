const db = require('../../utilities/database');
const { constants, utils, errorHandler, messages } = require('../../core');
const { Op } = require('sequelize');

const getRoles = async () => {
  return await db.findByCondition({ status: true}, 'Roles',['role', 'name']);
};

const getAdminUsers  = async (payload) => {
    const {limit} = constants;
    const offset = (payload.page - 1) * limit;
    let condition = 'u.status != 0 and u.role=1 and r.status = true';
    if(payload.search){
        condition+= ` and u.name ilike '%${payload.search}%'`;
    }
    const users = await db.rawQuery(
        `SELECT COUNT(u.id)::int from users as u left join user_roles as ur on u.id = ur.user_id
         left join roles as r on r.role = ur.role
         where ${condition}`,
        'SELECT'
    );
    const list = await db.rawQuery(
        `select u.id, u.name, u.email, u.status, u.store_id, r.name as role, r.role as accessRole, r.role as roleId
          from users as u left join user_roles as ur on u.id = ur.user_id
          left join roles as r on r.role = ur.role
          where ${condition} ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        'SELECT'
    );
    return ({list, total_rows: users[0].count});
  };

const changeAdminUserPassword = async (payload) => {
  const password = utils.encryptpassword(payload.password);
  return await Promise.all([
    db.updateOneByCondition({ password, updated_by: payload.updated_by, updated_at: new Date() }, {id: payload.user_id}, 'User'),
    db.deleteRecord({ user_id: payload.user_id }, 'UserDevices')
  ]);
};  

const addAdminUser = async (payload) => {
  const user = await db.findOneByCondition({ email: payload.email, role: {[Op.ne]: 2} }, 'User',['id']);
  if(user) throw errorHandler.customError(messages.emailAlreadyExists);
  const password = utils.encryptpassword(payload.password);
  let transaction = await db.dbTransaction();
  try {  
      const data = {
        ...payload,
        password,
        role: 1,
        store_id: payload.store_id || '',
        mobile: 'XXXXXX'+utils.generateRandom(5, false),
        updated_by: payload.created_by,
        created_at: new Date(),
        updated_at: new Date(),
        channel: constants.sale_channel.STORE
      };
      const user = await db.saveData(data, 'User', transaction);
      await db.saveData({
        user_id: user.id,
        role: payload.role_name,
        created_by: payload.created_by,
        updated_by: payload.created_by
      }, 'UserRoles', transaction);
      await transaction.commit();
      return true;
  } catch(error) {
      console.log('Error:', error);
      transaction.rollback();
      throw new Error(error.message);
  }
};  

const updateAdminUser = async (payload) => {
  const user = await db.findOneByCondition({ id: payload.id }, 'User',['name', 'password', 'store_id']);
  if(!user) throw errorHandler.customError(messages.systemError);
  const isEmail = await db.findOneByCondition({ email: payload.email, role: { [Op.ne]: 2 }, id: { [Op.ne]: payload.id } }, 'User', ['id']);
  if (isEmail) throw errorHandler.customError(messages.emailAlreadyExists);
  if(payload.old_password && user.password !== utils.encryptpassword(payload.old_password)) throw new Error('old_password The old password you have entered is incorrect');
  const password = payload.password ? utils.encryptpassword(payload.password) : user.password;
  const userRole = await db.findOneByCondition({ user_id: payload.id }, 'UserRoles');
  let transaction = await db.dbTransaction();
  try {  
      delete payload.old_password;
      const data = {
        ...payload,
        password,
        updated_at: new Date(),
      };
      const logsData = {
        source_id: payload.id,
        type: constants.logs_type.admin_user,
        action: 'Admin user updated',
        new_val: {},
        old_val: {},
        created_at: new Date(),
        created_by: payload.updated_by
      };
      if(user.name !== payload.name){
        logsData.new_val.name = payload.name;
        logsData.old_val.name = user.name;
      }
      if(user.store_id !== payload.store_id){
        logsData.new_val.store_id = payload.store_id;
        logsData.old_val.store_id = user.store_id;
      }
      if(userRole.role !== payload.role_name){
        logsData.new_val.role = payload.role_name;
        logsData.old_val.role = userRole.role;
      }
      await Promise.all([
        db.updateOneByCondition(data, { id: payload.id }, 'User', transaction),
        db.updateOneByCondition({
          updated_at: new Date(), 
          updated_by: payload.updated_by, 
          role: payload.role_name
        }, { user_id: payload.id }, 'UserRoles', transaction),
        db.saveData(logsData, 'Logs', transaction)
      ]);
      await transaction.commit();
      return true;
  } catch(error) {
      console.log('Error:', error);
      transaction.rollback();
      throw new Error(error.message);
  }
};  

const updateAdminUserStatus = async (payload) => {
  const user = await db.findOneByCondition({ id: payload.updated_by }, 'User',['password']);
  if(!user) throw errorHandler.customError(messages.systemError);
  if(user.password !== utils.encryptpassword(payload.password)) throw new Error('password The password you have entered is incorrect');
  await db.updateOneByCondition({
    status: payload.status,
    updated_by: payload.updated_by,
    updated_at: new Date()
  }, { id: payload.id }, 'User');
  if(payload.status === 2) {
    await db.deleteRecord({ user_id: payload.id }, 'UserDevices');
  }
  return true; 
}; 

const getEmployee  = async (payload) => {
  const {limit} = constants;
  const offset = (payload.page - 1) * limit;
  let condition = 'u.role = 3 and u.status = 1';
  if(payload.search){
      condition+= ` and u.name ilike '%${payload.search}%'`;
  }
  if(payload.role){
    condition+= ` and ur.role = '${payload.role}'`;
  }
  if(payload.store_id){
    condition+= ` and u.store_id = '${payload.store_id}'`;
  }
  const users = await db.rawQuery(
      `SELECT COUNT(u.id)::int from users as u 
       left join user_roles as ur on u.id = ur.user_id
       left join roles as r on r.role = ur.role
       where ${condition}`,
      'SELECT'
  );
  const list = await db.rawQuery(
      `select u.id, u.name, u.email, u.emp_ref_code, u.store_id, ur.role as role_id, r.name as role, s.name as store_name, s.city
        from users as u left join user_roles as ur on u.id = ur.user_id
        left join roles as r on r.role = ur.role
        left join stores as s on u.store_id = cast(s.id as varchar)
        where ${condition} ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      'SELECT'
  );
  return ({list, total_rows: users[0].count});
};

const addEmployee = async (payload) => {
  const user = await db.findOneByCondition({ email: payload.email, role: {[Op.ne]: 2}}, 'User',['id']);
  if(payload.email && user) throw errorHandler.customError(messages.emailAlreadyExists);
  const password = utils.encryptpassword('Eyewear2022');
  let transaction = await db.dbTransaction();
  try {  
      const data = {
        ...payload,
        password,
        role: 3,
        mobile: 'XXXXXX'+utils.generateRandom(5, false),
        updated_by: payload.created_by,
        created_at: new Date(),
        updated_at: new Date(),
        channel: constants.sale_channel.STORE
      };
      const user = await db.saveData(data, 'User', transaction);
      await db.saveData({
        user_id: user.id,
        role: payload.role_name,
        created_by: payload.created_by,
        updated_by: payload.created_by
      }, 'UserRoles', transaction);
      await transaction.commit();
      return true;
  } catch(error) {
      console.log('Error:', error);
      transaction.rollback();
      throw new Error(error.message);
  }
};  

const updateEmployee = async (payload) => {
  let transaction = await db.dbTransaction();
  const isEmail = await db.findOneByCondition({ email: payload.email, role: { [Op.ne]: 2 }, id: { [Op.ne]: payload.id } }, 'User', ['id']);
  if (payload.email && isEmail) throw errorHandler.customError(messages.emailAlreadyExists);
  try { 
      const user = await db.findOneByCondition({ id: payload.id }, 'User');
      const userRole = await db.findOneByCondition({ user_id: payload.id }, 'UserRoles');
      const data = {
        ...payload,
        updated_at: new Date(),
      };
      const logsData = {
        source_id: payload.id,
        type: constants.logs_type.employee,
        action: 'Employee updated',
        new_val: {},
        old_val: {},
        created_at: new Date(),
        created_by: payload.updated_by
      };
      if(user.emp_ref_code !== payload.emp_ref_code){
        logsData.new_val.emp_ref_code = payload.emp_ref_code;
        logsData.old_val.emp_ref_code = user.emp_ref_code;
      }
      if(user.name !== payload.name){
        logsData.new_val.name = payload.name;
        logsData.old_val.name = user.name;
      }
      if(user.store_id !== payload.store_id){
        logsData.new_val.store_id = payload.store_id;
        logsData.old_val.store_id = user.store_id;
      }
      if(userRole.role !== payload.role_name){
        logsData.new_val.role = payload.role_name;
        logsData.old_val.role = userRole.role;
      }
      
      await Promise.all([
        db.updateOneByCondition(data, { id: payload.id }, 'User', transaction),
        db.updateOneByCondition({
          updated_at: new Date(), 
          updated_by: payload.updated_by, 
          role: payload.role_name
        }, { user_id: payload.id }, 'UserRoles', transaction),
        db.saveData(logsData, 'Logs', transaction)
      ]);
      await transaction.commit();
      return true;
  } catch(error) {
      console.log('Error:', error);
      transaction.rollback();
      throw new Error(error.message);
  }
}; 

const deleteEmployee = async (payload) => {
      await db.updateOneByCondition({status: 0, updated_by: payload.updated_by, updated_at: new Date()}, { id: payload.id }, 'User');
}; 

module.exports = {
    getRoles,
    getAdminUsers,
    changeAdminUserPassword,
    addAdminUser,
    updateAdminUser,
    updateAdminUserStatus,
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
