import {LOGOUT} from '../../redux/constants';
import {toastAction} from '../../redux/ToastActions';
import env from '../../environment';

export default (response, dispatch, language = 'id') => {
    const data = response.data;
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        dispatch({type: LOGOUT});
        window.location.href=env.loginUrl;
      }
      const errorMessage = data && data.message ? (data.message[language][language] || data.message[language]  || data.message) : (response.statusText || response.message.en);
      toastAction(false, errorMessage);
      return Promise.reject(errorMessage);
};
