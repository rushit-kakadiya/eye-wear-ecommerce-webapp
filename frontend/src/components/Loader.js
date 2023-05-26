import React from 'react';
import ReactLoading from 'react-loading';

export default (status) => {
    return status && <ReactLoading className="loader" type={'cylon'} color="#5e72e4" height={'20%'} width={'10%'} />
}