import { combineReducers } from 'redux';
import { messageBoxReducer } from './reducers/messageBoxReducer';
import { loadingScreenReducer } from './reducers/loadingScreenReducer.js';

/** Persist redux state on refresh */
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
    key: 'root',
    storage: storageSession,
    blacklist: [/**'Prevent persist states'*/]
}

const storeReducer = combineReducers({
    messageBox: messageBoxReducer,
    loadingScreen: loadingScreenReducer
})

export default persistReducer(persistConfig, storeReducer);