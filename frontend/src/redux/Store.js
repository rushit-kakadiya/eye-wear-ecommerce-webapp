import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";
import Reducers from "./Reducers";

export function configureStore(InitialState) {
  const Store = createStore(
    Reducers,
    InitialState,
    process.env.NODE_ENV !== 'production' ? composeWithDevTools(applyMiddleware(thunk)) : compose(applyMiddleware(thunk))
  );
  const Persistor = persistStore(Store);
  return { Persistor, Store };
}
