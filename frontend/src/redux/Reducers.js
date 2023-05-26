import storage from "redux-persist/lib/storage";
import { persistCombineReducers } from "redux-persist";
import { connectRouter } from "connected-react-router";
import { encryptor } from "./Encryptor";
import { History } from "../jwt/_helpers";
import settings from "./settings/Reducer";
import user from "./user";
import order from "./order";
import stores from "./stores";
import frames from './frames';
import cart from './cart';
import lenses from './lenses';
import prescription from './prescription';
import banks from './banks';
import analytics from './analytics';
import order_history from './order-history';
import performance_detail from './performance-detail';
import dashboard from './dashboard';
import customer from './customer';
import clipons from './clipons';
import hto from './hto';
import discount from './discount';
import contact_lens from './contact-lens';
import other_product from './other-product';
import user_management from './user-management';
import account from './account';
import admin_stores from "./admin-store";
import products from "./products";
import employees from './employee';

const persistConfig = {
  key: "eyewear-admin",
  storage: storage,
  transforms: [encryptor],
  blacklist: ["router"],
};

const Reducers = persistCombineReducers(persistConfig, {
  router: connectRouter(History),
  settings,
  order,
  stores,
  user,
  frames,
  cart,
  lenses,
  prescription,
  banks,
  analytics,
  order_history,
  performance_detail,
  dashboard,
  customer,
  clipons,
  hto,
  discount,
  contact_lens,
  other_product,
  user_management,
  account,
  store: admin_stores,
  products,
  employees
});

export default Reducers;
