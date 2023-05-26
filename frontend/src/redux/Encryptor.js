import { encryptTransform } from "redux-persist-transform-encrypt";

export const encryptor = encryptTransform({
    secretKey: "admin-portal-secret-key",
});