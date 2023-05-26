const db = require('../../utilities/database');
const { utils, errorHandler } = require('../../core');


const resetPassword = async (payload) => {
    let oldPassword  =  utils.encryptpassword(payload.old_password);
    
    let newPassword = utils.encryptpassword(payload.new_password);
    let userId = payload.user_id;

    let replacements = {
        oldPassword,
        newPassword,
        userId
    };

    let oldPasswordCheckQuery = 'select password from users where id = :userId and password = :oldPassword';
    let resetPasswordQuery = 'update users set password = :newPassword where id = :userId';


    const data = await db.rawQuery(oldPasswordCheckQuery, 'SELECT', replacements);

    if(data[0]){
        await db.rawQuery(resetPasswordQuery, 'SELECT', replacements);
        return {status : true, message : 'your password has been changed successfully'};
    }else{
        throw new Error('old_password The old password you have entered is incorrect');
    }
};



const resetTimezone = async (payload) => {

    let time_zone = payload.time_zone;
    let userId = payload.user_id;

    let replacements = {
        time_zone,
        userId
    };

    let resetTimezoneQuery = 'update users set time_zone = :time_zone where id = :userId';

    await db.rawQuery(resetTimezoneQuery, 'SELECT', replacements);
    return { status : true, time_zone };

};



module.exports = {
    resetPassword,
    resetTimezone
};