import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'reactstrap';
import UserList from '../../views/user/List';
import ChangePassword from '../../views/modal/ChangePassword';
import UpdateStatus from '../../views/modal/updateUserStatus';
import {fetchAdminUsers, setUserId, setUserPassword, updateAdminUserStatus} from '../../redux/user-management/action';

export default (props) => {
    const [state, setState] = useState({page:1, search: '',  channel:'', created_at: null, dob: null});
    const [search, setSearch] = useState('');
    const [modal, setModal] =  useState({});
    const [status, setStatus] =  useState({});
    const [error, setError] =  useState({});
    const dispatch = useDispatch();
    const {user_management, user} = useSelector(state => state);

    useEffect(()  => {
        dispatch(fetchAdminUsers({page: state.page}));
        dispatch(setUserId(''));
    }, [dispatch, state.page]);
    
    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    // Handle event on page change
    const handlePageChange = (page) => {
        setState({...state, page});
    }

    // Handle search submit
    const handleFilterSubmit = () => {
        dispatch(fetchAdminUsers({page: 1, search}));
    }

    // Change password 
    const onChangePassword = (data) => {
        dispatch(setUserPassword({...data, user_id: user_management.selectedUserId}))
        .then(() => toggle('resetPassword'))
        .catch(error => console.log("error", error));
    }

    //Set selected userID
    const setSelectedUserId = (id) => {
        dispatch(setUserId(id));
    }

    const onUpdateStatus = (data) => {
        dispatch(updateAdminUserStatus({...data, id: user_management.selectedUserId, status: status === 1 ? 2 : 1}))
        .then(() => toggle('updateStatus'))
        .catch((err) => {
            setError(err);
        });
    }

    // Pagination options
    const options = {
        sortIndicator: true,
        page: state.page,
        onPageChange: handlePageChange,
        hideSizePerPage: true,
        paginationSize: 10,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: true,
        sizePerPage: 10,
        noDataText: user_management.is_loading ? "Loading ..." : "There is no data to display!"
    }; 

    return(
        <>
            <UserList
                options={options}
                user={user_management}
                history={props.history}
                setSearch={setSearch.bind(null)}
                handleFilterSubmit={handleFilterSubmit.bind(null)}
                toggle={toggle.bind(null)}
                setUserId={setSelectedUserId.bind(null)}
                userData={user.data || {}}
                setStatus={setStatus.bind(null)}
            />
            <Modal
                isOpen={modal.resetPassword}
                toggle={()=>toggle('resetPassword')}
                size="md"
            > 
            <ChangePassword
                toggle={()=>toggle('resetPassword')}
                onChangePassword={onChangePassword.bind(null)}
            />
            </Modal>
            <Modal
                isOpen={modal.updateStatus}
                toggle={()=>toggle('updateStatus')}
                size="md"
            > 
            <UpdateStatus
                toggle={()=>toggle('updateStatus')}
                onSubmit={onUpdateStatus.bind(null)}
                text={status === 1 ? 'danger' : 'success'}
                error={error}
                loading={user_management.is_loading}
            />
            </Modal>
        </>
    )
}