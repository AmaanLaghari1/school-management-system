import storage from 'redux-persist/lib/storage';
import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import persistStore from 'redux-persist/es/persistStore';
import AuthReducer from '../reducers/AuthReducer';
import persistReducer from 'redux-persist/es/persistReducer';

const authPersistConfig = {
    key: 'auth',
    storage
}

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, AuthReducer)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
)

const persistor = persistStore(store)

export { store, persistor }