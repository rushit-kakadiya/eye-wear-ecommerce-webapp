import { Db } from "./Firebase";

// User API

export const doCreateUser = (id, username, email) =>
  Db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () => Db.ref("users").once("value");
