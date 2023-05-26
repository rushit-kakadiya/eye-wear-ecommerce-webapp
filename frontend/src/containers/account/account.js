import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { resetUserTimezone } from '../../redux/user/action';
import { resetUserPassword } from '../../redux/account/action';
import Account from '../../views/account/account';




export default (props) =>{

    const dispatch = useDispatch();

    const { account, user } = useSelector(state => state);

    const resetPassword = (data,cb) => {
        dispatch(resetUserPassword(data,cb))
    }


    const resetTimezone = (data) => {
        dispatch(resetUserTimezone(data))
    }


    return(
        <Account 
            {...props}
            resetPassword={resetPassword}
            resetTimezone={resetTimezone}
            loading={account.is_loading}
            time_zone= {user.data.time_zone ?  user.data.time_zone : 'Asia/Jakarta'}
        />
    )
}