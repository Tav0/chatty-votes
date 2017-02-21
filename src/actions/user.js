import api from '../api';
import apiAction from './apiAction';
import { browserHistory } from 'react-router';

export function register({ username, firstname, lastname, password, email }) {
/*
 * Implement REGISTER.
 */
    return apiAction({
        baseType: 'REGISTER',
        fetch() {
            return api.user.register({username: username, firstname: firstname, lastname: lastname, password: password, email: email});
        },
        onSuccess(dispatch, data, getState) {
            console.log("success in loggin in!");
            browserHistory.replace(`/login`);
        }
    });
}

export function updateProfile(id, { username, firstname, lastname, password, email }, onSuccess) {
    return apiAction({
        baseType: 'UPDATE_PROFILE',
        fetch() {
            return api.user.updateProfile(id, {username: username, firstname: firstname, lastname: lastname, password: password, email: email});
        },
        onSuccess(dispatch, data, getState) {
            console.log("success in updating profile");
            onSuccess();
        }
    });
}

export function getProfile(id) {
/*
 * Implement FETCH_PROFILE.
 */
    return apiAction({
        baseType: 'FETCH_PROFILE',
        fetch() {
            return api.user.getProfile(id);
        },
        onSuccess(dispatch, data, getState) {
            console.log("success in fetching profile");
        }
    });
}

export function listusers({page}) {
/*
 * Implement FETCH_USER_LIST.
 */
    return apiAction({
        baseType: 'FETCH_USER_LIST',
        fetch() {
            return api.user.listusers({page});
        },
        onSuccess(dispatch, data, getState) {
            console.log("success in fetching users");
        }
    }); 
}
