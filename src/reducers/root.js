import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import admin from './admin';
import survey from './survey';
import surveylist from './surveylist.js';

const rootReducer = combineReducers({
    auth,
    admin,
    survey,
    surveylist,
    form: formReducer,
});

export default rootReducer;
