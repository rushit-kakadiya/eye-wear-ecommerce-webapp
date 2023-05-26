
export default (token, multiPartFormData = null) => {
  // return authorization header with jwt token
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else if(multiPartFormData) {
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
  } else {
    return {};
  }
};
