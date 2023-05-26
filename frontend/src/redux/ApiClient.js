import axios from "axios";
import querystring from "query-string";
import env from '../environment';
import AuthHeader from '../jwt/_helpers/AuthHeader';


const headers = { 'Content-Type': 'application/json', 'x-api-key': env.apiKey };

export default class ApiClient {
  static post(url, params, token) {
    return new Promise((fulfill, reject) => {
      axios
        .post(`${env.apiUrl}/${url}`, JSON.stringify(params), { headers: { ...headers, ...AuthHeader(token) } })
        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response) {
            reject(error.response);
          } else {
            reject(error);
          }
        });
    });
  }

  static put(url, params, token) {
    return new Promise((fulfill, reject) => {
      axios
        .put(`${env.apiUrl}/${url}`, JSON.stringify(params), { headers: { ...headers, ...AuthHeader(token) } })
        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response) {
            reject(error.response);
          } else {
            reject(error);
          }
        });
    });
  }

  static get(url, params, token) {
    let query = querystring.stringify(params);
    url = query ? `${url}?${query}` : url;
    return new Promise((fulfill, reject) => {
      axios
        .get(`${env.apiUrl}/${url}`, { headers: { ...headers, ...AuthHeader(token) } })

        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response) {
            reject(error.response);
          } else {
            reject(error);
          }
        });
    });
  }

  static delete(url, token, data = null) {
    return new Promise((fulfill, reject) => {
      let config = { headers: { ...headers, ...AuthHeader(token) } };
      if (data) {
        config = { ...config, data };
      }
      axios
        .delete(`${env.apiUrl}/${url}`, config)
        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response) {
            reject(error.response);
          } else {
            reject(error);
          }
        });
    });
  }

  /*************** Form-Data Method ***********/
  static postFormData(url, params, token = '') {
    const multiPartHeader = { 'Content-Type': 'multipart/form-data' };
    return new Promise(function (fulfill, reject) {
      var body = new FormData();
      body.append('file', params);
      axios
        .post(`${env.apiUrl}/${url}`, body, { headers: { ...headers, ...multiPartHeader, ...AuthHeader(token) } })
        .then(function (response) {
          fulfill({ status: response.status, data: response.data });
        })
        .catch(function (error) {
          if (error && error.response) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static postForumData(url, params, token = '') {
    const multiPartHeader = { 'Content-Type': 'multipart/form-data' };
    return new Promise(function (fulfill, reject) {
      var body = new FormData();
      body.append('file', params.file);
      body.append('type', params.type);
      body.append('id', params.id);
      axios
        .post(`${env.apiUrl}/${url}`, body, { headers: { ...headers, ...multiPartHeader, ...AuthHeader(token) } })
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

}


