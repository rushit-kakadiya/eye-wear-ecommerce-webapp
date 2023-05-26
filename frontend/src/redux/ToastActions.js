/*
 * @file: toast-actions.js
 * @description: It Contain toasts Action function.
 */

import { toast } from 'react-toastify';

export const toastAction = (status, message) => {
    if (status) {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    } else {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    }
};

